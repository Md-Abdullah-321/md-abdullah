"use client";

/**
 * useVideoPlayer — the single React integration point between a video
 * component and the global playback manager.
 *
 * A component supplies an imperative player surface (start/stop/getStatus)
 * that reads live refs — the YouTube player may boot asynchronously after
 * start() is called. The hook builds the per-instance playback controller,
 * registers it with the global manager (once the observed element exists),
 * subscribes React state, and exposes manager-routed play/pause so the
 * single-active-video policy is always enforced.
 *
 * The `player` object MUST be referentially stable (created once, e.g. in a
 * useRef) so the controller always calls into the live player.
 */

import { useEffect, useMemo, useSyncExternalStore, type RefObject } from "react";
import {
  registerVideoController,
  requestVideoPause,
  requestVideoPlay,
  notifyVideoPlaying,
  type VideoPlaybackState,
} from "@/lib/videos/playback";
import {
  createVideoController,
  type VideoControllerHandle,
} from "@/lib/videos/video-controller";

export type VideoPlayerStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "ended"
  | "destroyed";

export interface VideoPlayerSurface {
  /** Begin playback. May boot the player asynchronously. */
  start: () => void;
  /** Stop playback. Safe to call when idle. */
  stop: () => void;
  /** Provider playback status for the manager's bookkeeping. */
  getStatus: () => VideoPlayerStatus;
}

/** Server snapshot for useSyncExternalStore (idle before hydration). */
const IDLE_STATE: VideoPlaybackState = { phase: "idle" };

export function useVideoPlayer(opts: {
  provider: "youtube" | "loom";
  /** Underlying video id (used to derive a stable internal id). */
  videoId: string;
  /** Ref to the element whose viewport visibility governs pause-on-scroll. */
  rootRef: RefObject<HTMLElement | null>;
  /** Provider mechanics for this specific player instance. */
  player: VideoPlayerSurface;
}) {
  // The controller is created once per mounted video instance. The observed
  // element is attached at registration time (below), not at creation.
  const controller: VideoControllerHandle = useMemo(
    () =>
      createVideoController(opts.provider, opts.videoId, {
        start: opts.player.start,
        stop: opts.player.stop,
        getStatus: opts.player.getStatus,
      }),
    // The player methods are stable (they read live refs), so they are
    // intentionally not dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [opts.provider, opts.videoId]
  );

  // Register once the observed element exists; unregister + cleanup on
  // unmount.
  useEffect(() => {
    const root = opts.rootRef.current;
    if (!root) return;
    return registerVideoController(controller, root);
  }, [controller, opts.rootRef]);

  // Subscribe React to controller playback-state changes.
  const playbackState: VideoPlaybackState = useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    () => IDLE_STATE
  );

  return {
    id: controller.videoId,
    playbackState,
    /** Request playback through the global manager (pauses other videos). */
    play: () => requestVideoPlay(controller.videoId),
    /** Request autoplay through the global manager (intentional autoplay). */
    autoplay: () => requestVideoPlay(controller.videoId, { autoplay: true }),
    /** Request a manual pause through the global manager. */
    pause: () => requestVideoPause(controller.videoId),
    /** Report a coarse provider status change to the controller. */
    reportStatus: (status: VideoPlayerStatus) => {
      if (status === "playing") {
        // A provider reported actual playback (user hit native play, or an
        // autoplay began). Claim single-active status through the manager so
        // no other video keeps playing.
        notifyVideoPlaying(controller.videoId);
      }
      controller.reportStatus(status);
    },
    /** Tear down this player and unregister it. */
    destroy: () => controller.destroy(),
  };
}
