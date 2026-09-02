/**
 * YouTube IFrame API loading helper, shared by every player on the site
 * (hero video modal, project video embeds). Loads the official iframe_api
 * script once and resolves with the `YT` namespace. Browser-only — call it
 * from client effects only.
 */

export type YouTubePlayer = {
  destroy: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  setVolume: (volume: number) => void;
  unMute: () => void;
  getCurrentTime?: () => number;
  getDuration?: () => number;
  getPlayerState?: () => number;
  addEventListener?: (
    event: string,
    listener: (event: { data: number }) => void
  ) => void;
  removeEventListener?: (
    event: string,
    listener: (event: { data: number }) => void
  ) => void;
};

export type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      /** e.g. "https://www.youtube-nocookie.com" to keep cookies off. */
      host?: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (event: { target: YouTubePlayer }) => void;
        onStateChange?: (event: { data: number }) => void;
      };
    }
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** YouTube IFrame API player states. */
export const YT_STATE = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

/** Cookies are kept off by embedding through youtube-nocookie.com. */
export const YOUTUBE_NOCOOKIE_HOST = "https://www.youtube-nocookie.com";

export function loadYouTubeApi(): Promise<YouTubeApi> {
  if (window.YT) return Promise.resolve(window.YT);

  return new Promise<YouTubeApi>((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      if (window.YT) resolve(window.YT);
    };

    if (
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

/** Progress milestones, each reported at most once per play session. */
export const PROGRESS_MILESTONES = [25, 50, 75] as const;
export type ProgressMilestone = (typeof PROGRESS_MILESTONES)[number];

/**
 * Observes an already-constructed YouTube player for progress milestones and
 * completion.
 *
 * The IFrame API only emits discrete state changes, so current time is
 * sampled once per second *only while the player is playing* — never an
 * event per second. Each 25/50/75 milestone is reported once per play
 * session; completion is reported once per session from the ENDED state.
 * Replaying the video after it ends starts a fresh session.
 *
 * Returns a cleanup function (call when the player is destroyed).
 */
export function watchYouTubePlayback(
  player: YouTubePlayer,
  handlers: {
    onProgress: (percent: ProgressMilestone) => void;
    onComplete: () => void;
  }
): () => void {
  let interval: number | undefined;
  let milestonesFired = new Set<number>();
  let completionFired = false;
  let ended = false;

  const clearSampler = () => {
    if (interval !== undefined) {
      window.clearInterval(interval);
      interval = undefined;
    }
  };

  const startSampler = () => {
    if (interval === undefined) interval = window.setInterval(sample, 1000);
  };

  const resetSession = () => {
    milestonesFired = new Set();
    completionFired = false;
    ended = false;
  };

  const sample = (force = false) => {
    if (!force && player.getPlayerState?.() !== YT_STATE.PLAYING) return;
    const duration = player.getDuration?.() ?? 0;
    const time = player.getCurrentTime?.() ?? 0;
    if (duration <= 0 || time <= 0) return;

    const percent = Math.round((time / duration) * 100);
    for (const milestone of PROGRESS_MILESTONES) {
      if (percent >= milestone && !milestonesFired.has(milestone)) {
        milestonesFired.add(milestone);
        handlers.onProgress(milestone);
      }
    }
  };

  const onStateChange = (event: { data: number }) => {
    const state = event.data;

    if (state === YT_STATE.PLAYING) {
      // A new session starts when playback begins again after ending.
      if (ended) resetSession();
      startSampler();
      return;
    }

    clearSampler();

    if (state === YT_STATE.ENDED) {
      // Flush any milestone reached at the final playback position, then
      // report completion. Replays start a fresh session.
      sample(true);
      if (!completionFired) {
        completionFired = true;
        handlers.onComplete();
      }
      ended = true;
    }
  };

  player.addEventListener?.("onStateChange", onStateChange);

  // If playback already started before the listener attached, begin sampling.
  if (player.getPlayerState?.() === YT_STATE.PLAYING) startSampler();

  return () => {
    player.removeEventListener?.("onStateChange", onStateChange);
    clearSampler();
  };
}
