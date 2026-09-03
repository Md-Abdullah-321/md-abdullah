/**
 * Global single-video playback coordinator.
 *
 * Every video on the site registers a lightweight controller with this
 * manager. The manager owns the ONLY playback policy on the page:
 *
 * - Only ONE video can be playing at any time. Requesting playback for a
 *   video pauses whatever is currently active first.
 * - A video is never paused because another video became visible — only
 *   because a controller reported it left the meaningful viewport.
 * - There is deliberately no "became visible again → resume" behavior.
 *   A video that was paused (for any reason) stays paused until the user
 *   explicitly requests playback again.
 *
 * The manager is provider-agnostic: controllers (YouTube, Loom iframe,
 * future providers) expose a tiny play()/pause()/getState()/destroy()
 * contract, and the manager only talks to that contract.
 */

/* ─── Public types ─────────────────────────────────────── */

export type VideoProviderName = "youtube" | "loom";

/** Why a video was paused. Never sent to analytics — internal only. */
export type VideoPauseReason = "user" | "visibility" | "another_video" | "teardown";

/** Coarse playback status the manager uses for bookkeeping. */
export type VideoPlaybackStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "ended"
  | "destroyed"
  | "unstarted"
  | "buffering"
  | "cued"
  | "error";

/** Rich playback state, exposed to components through the controller. */
export type VideoPlaybackState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "playing" }
  | { phase: "paused"; reason: VideoPauseReason }
  | { phase: "ended" }
  | { phase: "destroyed" };

/**
 * Minimal contract a video registers with the manager. Provider internals
 * stay inside the controller — the manager only uses these members.
 */
export interface VideoController {
  /** Stable internal id for the manager's registry. */
  readonly videoId: string;
  readonly provider: VideoProviderName;
  /** Start playback (used for both user-initiated and intentional autoplay). */
  play: () => void;
  /** Pause playback. Must be safe to call in any phase. */
  pause: () => void;
  /** Pause playback, recording why (visibility / another video / teardown). */
  pauseWithReason: (reason: VideoPauseReason) => void;
  /** Coarse current state, for the manager's synchronous bookkeeping. */
  getStatus: () => VideoPlaybackStatus;
  /** Release the player, its listeners and observers. Idempotent. */
  destroy: () => void;
}

/* ─── Policy constants ─────────────────────────────────── */

/** Less than this fraction of the video visible while playing → pause. */
export const VISIBILITY_THRESHOLD = 0.4;

/* ─── Manager state ────────────────────────────────────── */

type ControllerEntry = {
  controller: VideoController;
  /** Whether the controller's root is currently in the meaningful viewport. */
  visible: boolean;
  /** Set when an autoplay request arrived before the video was visible. */
  pendingAutoplay: boolean;
  /** Stability timer for deferred autoplay (cleared when the video leaves). */
  autoplayTimer: number | undefined;
};

let instance: VideoPlaybackManager | null = null;

/**
 * The global video playback manager. One instance per page, created lazily
 * on first use. All coordination happens through this singleton.
 */
export class VideoPlaybackManager {
  private readonly controllers = new Map<string, ControllerEntry>();
  private observer: IntersectionObserver | null = null;
  private activeVideoId: string | null = null;

  static getInstance(): VideoPlaybackManager {
    if (!instance) instance = new VideoPlaybackManager();
    return instance;
  }

  /**
   * Register a controller. The observed element is passed separately so the
   * caller can register as soon as the element exists (even though the
   * controller is created earlier). Returns an unregister function that
   * pauses the video if it is active, stops observing the element, and drops
   * it from the registry.
   */
  register(controller: VideoController, root: HTMLElement | null): () => void {
    const id = controller.videoId;
    if (this.controllers.has(id)) return () => {};

    this.controllers.set(id, {
      controller,
      visible: false,
      pendingAutoplay: false,
      autoplayTimer: undefined,
    });

    if (root) {
      this.ensureObserver().observe(root);
      root.setAttribute("data-video-id", id);
    }

    return () => {
      const entry = this.controllers.get(id);
      if (!entry || entry.controller !== controller) return;
      if (entry.autoplayTimer !== undefined) {
        window.clearTimeout(entry.autoplayTimer);
      }
      if (root) {
        this.observer?.unobserve(root);
        root.removeAttribute("data-video-id");
      }
      this.controllers.delete(id);
      if (this.activeVideoId === id) {
        this.activeVideoId = null;
        try {
          controller.pauseWithReason("teardown");
        } catch {
          // A failed pause must never break teardown of the page.
        }
      }
    };
  }

  /**
   * The single entry point every video calls when playback should start.
   * Pauses whichever video is currently active, then marks this video active
   * and starts it. The latest request wins, so rapid A → B → C clicks
   * converge on C.
   *
   * A video that is not currently in the viewport never starts — playback
   * requires the user to be looking at the video (or an intentional autoplay
   * such as the hero, which is deferred until the video actually becomes
   * visible).
   *
   * `options.autoplay` marks an intentional programmatic autoplay (the hero
   * video). If the video is not visible yet — e.g. the user navigated to the
   * home page mid-scroll — the autoplay is queued and fires the moment the
   * video scrolls into the viewport, then participates fully in
   * single-video coordination.
   */
  requestPlay(id: string, options?: { autoplay?: boolean }): void {
    const entry = this.controllers.get(id);
    if (!entry) return;

    if (!entry.visible) {
      // Hold intentional autoplay until the video is actually on screen;
      // never start a video the user cannot see.
      if (options?.autoplay) entry.pendingAutoplay = true;
      return;
    }

    // Intentional autoplay (hero) requires the video to remain visible for a
    // short stability window. This prevents it from starting while the user
    // is scrolling past the hero (smooth-scroll anchors, scroll restoration)
    // only to be paused a moment later.
    if (options?.autoplay && entry.autoplayTimer === undefined) {
      entry.autoplayTimer = window.setTimeout(() => {
        const current = this.controllers.get(id);
        if (!current || !current.visible) return;
        entry.autoplayTimer = undefined;
        this.startPlayback(id);
      }, 350);
      return;
    }

    this.startPlayback(id);
  }

  /** Pause the active video, mark the request active, and start it. */
  private startPlayback(id: string): void {
    const entry = this.controllers.get(id);
    if (!entry) return;

    entry.pendingAutoplay = false;
    if (entry.autoplayTimer !== undefined) {
      window.clearTimeout(entry.autoplayTimer);
      entry.autoplayTimer = undefined;
    }
    this.pauseActive(id);
    this.activeVideoId = id;
    try {
      entry.controller.play();
    } catch {
      // If starting fails, do not leave a stale active video behind.
      if (this.activeVideoId === id) this.activeVideoId = null;
    }
  }

  /** Report that the user manually paused a video (its own controls). */
  requestPause(id: string): void {
    const entry = this.controllers.get(id);
    if (!entry) return;

    if (this.activeVideoId === id) this.activeVideoId = null;
    try {
      entry.controller.pause();
    } catch {
      // A failed pause must never propagate.
    }
  }

  /**
   * Claim single-active playback for a video that has reported it is now
   * actually playing (e.g. the user hit the native YouTube play button on
   * the hero after it was paused). Any other active video is paused first so
   * two videos can never play at once.
   */
  notifyPlaying(id: string): void {
    const entry = this.controllers.get(id);
    if (!entry) return;

    if (this.activeVideoId && this.activeVideoId !== id) {
      this.pauseActive(id);
    }
    this.activeVideoId = id;
  }

  /** Pause whatever is playing right now (route change / page navigation). */
  pauseAll(): void {
    if (!this.activeVideoId) return;
    const active = this.controllers.get(this.activeVideoId);
    this.activeVideoId = null;
    if (active) {
      try {
        active.controller.pauseWithReason("teardown");
      } catch {
        // Pausing must never throw during navigation.
      }
    }
  }

  /** Whether a controller is currently the single active video. */
  isActive(id: string): boolean {
    return this.activeVideoId === id;
  }

  /** The id of the currently active video, if any. */
  getActiveVideoId(): string | null {
    return this.activeVideoId;
  }

  /**
   * IntersectionObserver callback — the ONLY place visibility becomes a
   * pause. A playing video is paused when less than ~40% of it remains
   * visible. Videos that become visible again are left alone: no resume.
   */
  private handleVisibility(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      const id = entry.target.getAttribute("data-video-id");
      if (!id) continue;
      const record = this.controllers.get(id);
      if (!record) continue;

      const ratio = entry.intersectionRatio;
      const nowVisible = ratio >= VISIBILITY_THRESHOLD;

      // Visibility is only used to pause a video that is already playing —
      // and to fire a deferred intentional autoplay (hero) the moment the
      // video actually scrolls into view.
      if (!record.visible && nowVisible) {
        record.visible = true;
        if (record.pendingAutoplay) {
          record.pendingAutoplay = false;
          this.requestPlay(id, { autoplay: true });
        }
        continue;
      }
      if (record.visible && !nowVisible) {
        record.visible = false;
        // Cancel a deferred autoplay that has not started yet — the video
        // was only passing through the viewport.
        if (record.autoplayTimer !== undefined) {
          window.clearTimeout(record.autoplayTimer);
          record.autoplayTimer = undefined;
          record.pendingAutoplay = true;
        }
        if (this.activeVideoId === id) this.visibilityPause(id);
      }
    }
  }

  /** Pause the active video because it left the viewport. */
  private visibilityPause(id: string): void {
    const entry = this.controllers.get(id);
    if (!entry) return;

    this.activeVideoId = null;
    try {
      entry.controller.pauseWithReason("visibility");
    } catch {
      // A failed pause must never crash the page; state is already cleared.
    }
  }

  /** Pause the currently active video before another one starts. */
  private pauseActive(exceptId: string): void {
    if (!this.activeVideoId || this.activeVideoId === exceptId) return;
    const previous = this.controllers.get(this.activeVideoId);
    this.activeVideoId = null;
    if (previous) {
      try {
        previous.controller.pauseWithReason("another_video");
      } catch {
        // The new request stays authoritative even if pausing the old video
        // throws (e.g. its player is already destroyed).
      }
    }
  }

  /** Lazily create the shared observer on first use (browser only). */
  private ensureObserver(): IntersectionObserver {
    if (!this.observer) {
      this.observer = new IntersectionObserver((entries) => {
        this.handleVisibility(entries);
      }, { threshold: [VISIBILITY_THRESHOLD] });
    }
    return this.observer;
  }
}

/* ─── Module-level convenience API ─────────────────────── */

/** Register a controller with the global manager (see VideoPlaybackManager). */
export function registerVideoController(
  controller: VideoController,
  root: HTMLElement | null
): () => void {
  return VideoPlaybackManager.getInstance().register(controller, root);
}

/** Request playback for a registered video (user click / intentional autoplay). */
export function requestVideoPlay(
  id: string,
  options?: { autoplay?: boolean }
): void {
  VideoPlaybackManager.getInstance().requestPlay(id, options);
}

/** Report a manual user pause for a registered video. */
export function requestVideoPause(id: string): void {
  VideoPlaybackManager.getInstance().requestPause(id);
}

/** Pause any currently playing video (route change / navigation). */
export function pauseAllVideos(): void {
  VideoPlaybackManager.getInstance().pauseAll();
}

/** Whether a registered video is currently the single active video. */
export function isVideoActive(id: string): boolean {
  return VideoPlaybackManager.getInstance().isActive(id);
}

/** Claim single-active playback for a video that just started (native play). */
export function notifyVideoPlaying(id: string): void {
  VideoPlaybackManager.getInstance().notifyPlaying(id);
}
