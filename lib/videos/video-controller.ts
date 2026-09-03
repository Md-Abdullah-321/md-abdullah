/**
 * Shared video playback controller — the bridge between a video component
 * and the global playback manager (lib/videos/playback.ts).
 *
 * A controller is created per mounted video instance. It owns the instance's
 * player lifecycle and reports playback state to the manager through the
 * VideoController contract; the manager owns all playback policy (single
 * active video, pause-on-leaving-the-viewport, no auto-resume).
 *
 * The component never decides "should I pause because another video
 * started?" — it only implements its provider mechanics (YouTube IFrame API,
 * Loom iframe, future providers) and forwards manager commands.
 */

import type {
  VideoPlaybackState,
  VideoPauseReason,
  VideoPlaybackStatus,
  VideoProviderName,
} from "./playback";

/* ─── Provider control surface ─────────────────────────── */

/**
 * The provider mechanics a component supplies for its player instance.
 * Internal implementation can differ per provider — the manager and the
 * component only see this surface.
 */
export interface PlaybackProviderControl {
  /** Begin playback. */
  start: () => void;
  /** Stop playback. Must be safe to call at any time / when idle. */
  stop: () => void;
  /** Map the provider's internal state to a coarse playback status. */
  getStatus: () => VideoPlaybackStatus;
}

/* ─── Controller handle ────────────────────────────────── */

export interface VideoControllerHandle {
  /** Stable internal id, registered with the playback manager. */
  readonly videoId: string;
  readonly provider: VideoProviderName;
  /** Current playback state snapshot. */
  readonly state: VideoPlaybackState;
  /** Subscribe to playback-state changes; returns an unsubscribe function. */
  subscribe: (listener: (state: VideoPlaybackState) => void) => () => void;
  getState: () => VideoPlaybackState;
  /** Coarse status for the manager's synchronous bookkeeping. */
  getStatus: () => VideoPlaybackStatus;
  /** Start playback (used for user clicks and intentional autoplay). */
  play: () => void;
  /** Pause playback. Safe to call in any phase. */
  pause: () => void;
  /** Report an externally-initiated pause (visibility / another video). */
  pauseWithReason: (reason: VideoPauseReason) => void;
  /**
   * Report a coarse provider status change (e.g. from a YouTube
   * onStateChange). Lets the controller transition its rich state and
   * notify subscribers without polling.
   */
  reportStatus: (status: VideoPlaybackStatus) => void;
  /** Release the player, its listeners and observers. Idempotent. */
  destroy: () => void;
}

let uid = 0;
const genId = () => `video-${++uid}`;

/**
 * Create a playback controller bound to one video instance. `control` is the
 * provider-specific implementation of start/stop/state mapping.
 */
export function createVideoController(
  provider: VideoProviderName,
  videoId: string,
  control: PlaybackProviderControl
): VideoControllerHandle {
  const id = `${genId()}-${provider}-${videoId}`;
  const listeners = new Set<(state: VideoPlaybackState) => void>();

  let state: VideoPlaybackState = { phase: "idle" };
  let destroyed = false;
  // Set when the manager pauses this video; the provider echoes PAUSED a
  // moment later, and that echo must not overwrite the manager's reason.
  let pendingPauseReason: VideoPauseReason | null = null;

  function setState(next: VideoPlaybackState): void {
    state = next;
    for (const listener of listeners) listener(state);
  }

  function setPlaying(): void {
    if (destroyed) return;
    pendingPauseReason = null;
    if (state.phase !== "playing") setState({ phase: "playing" });
  }

  function setPaused(reason: VideoPauseReason = "user"): void {
    if (destroyed) return;
    if (state.phase === "paused" && state.reason === reason) return;
    setState({ phase: "paused", reason });
  }

  function setEnded(): void {
    if (destroyed) return;
    pendingPauseReason = null;
    if (state.phase !== "ended") setState({ phase: "ended" });
  }

  function syncStatusFromProvider(): void {
    if (destroyed) return;
    const status = control.getStatus();
    if (status === "playing") setPlaying();
    else if (status === "ended") setEnded();
    else if (status === "paused") {
      if (pendingPauseReason) {
        const reason = pendingPauseReason;
        pendingPauseReason = null;
        setPaused(reason);
      } else {
        setPaused("user");
      }
    }
  }

  const handle: VideoControllerHandle = {
    videoId: id,
    provider,
    get state() {
      return state;
    },
    getState() {
      return state;
    },
    getStatus(): VideoPlaybackStatus {
      return control.getStatus();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    play() {
      if (destroyed) return;
      setState({ phase: "loading" });
      try {
        control.start();
        syncStatusFromProvider();
      } catch {
        setPaused("user");
      }
    },
    pause() {
      if (destroyed) return;
      try {
        control.stop();
      } catch {
        // A failed pause must never throw into the manager.
      }
      setPaused("user");
      syncStatusFromProvider();
    },
    pauseWithReason(reason) {
      if (destroyed) return;
      pendingPauseReason = reason;
      try {
        control.stop();
      } catch {
        // Best-effort stop.
      }
      setPaused(reason);
    },
    reportStatus(status: VideoPlaybackStatus) {
      if (destroyed) return;
      if (status === "playing") setPlaying();
      else if (status === "ended") setEnded();
      else if (status === "paused") {
        if (pendingPauseReason) {
          const reason = pendingPauseReason;
          pendingPauseReason = null;
          setPaused(reason);
        } else {
          setPaused("user");
        }
      } else if (status === "loading" && state.phase === "idle") {
        setState({ phase: "loading" });
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      try {
        control.stop();
      } catch {
        // Best-effort teardown.
      }
      listeners.clear();
      state = { phase: "destroyed" };
    },
  };

  return handle;
}
