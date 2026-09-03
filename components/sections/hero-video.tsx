"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { pushDataLayerEvent } from "@/lib/analytics/data-layer";
import {
  loadYouTubeApi,
  watchYouTubePlayback,
  YOUTUBE_NOCOOKIE_HOST,
  YT_STATE,
  type YouTubePlayer,
} from "@/lib/videos/youtube";
import { useVideoPlayer } from "@/hooks/use-video-controller";

interface HeroVideoProps {
  videoId?: string;
  title?: string;
  className?: string;
}

/**
 * Inline, autoplaying hero video. Loads the YouTube player directly on mount
 * (no click-to-play thumbnail) and reports video_play / video_progress /
 * video_complete through the existing data layer.
 *
 * Autoplay on mount is the hero's intentional, existing behavior and is
 * preserved. It is routed through the global playback manager so the hero
 * participates in single-video coordination:
 * - Starting the hero pauses any other video that happens to be active.
 * - When the hero leaves the viewport it is paused.
 * - It does NOT automatically resume when scrolled back into view. The hero
 *   keeps its native controls, so the user restarts it explicitly (which
 *   goes back through the manager).
 */
export function HeroVideo({
  videoId = "avMXDXwstEE",
  title = "Md Abdullah - Automation & Integration Systems Walkthrough",
  className,
}: HeroVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerMountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const stopWatchingRef = useRef<(() => void) | null>(null);
  const buildTokenRef = useRef(0);
  const playReportedRef = useRef(false);

  const { playbackState, autoplay, reportStatus } = useVideoPlayer({
    provider: "youtube",
    videoId,
    rootRef: containerRef,
    player: {
      start: () => {
        // Resume an already-built player.
        if (playerRef.current) {
          try {
            playerRef.current.playVideo();
          } catch {
            // Player may be gone; fall through to a fresh build below.
          }
          return;
        }

        const token = ++buildTokenRef.current;
        loadYouTubeApi().then((YouTube) => {
          if (token !== buildTokenRef.current) return;
          if (!playerMountRef.current) return;

          const player = new YouTube.Player(playerMountRef.current, {
            videoId,
            host: YOUTUBE_NOCOOKIE_HOST,
            playerVars: {
              autoplay: 1,
              controls: 1,
              rel: 0,
              playsinline: 1,
              origin: window.location.origin,
              enablejsapi: 1,
            },
            events: {
              onReady: ({ target }) => {
                target.setVolume(100);
                target.unMute();
                target.playVideo();
              },
              onStateChange: ({ data }) => {
                if (data === YT_STATE.PLAYING) {
                  if (!playReportedRef.current) {
                    playReportedRef.current = true;
                    pushDataLayerEvent({
                      event: "video_play",
                      video_name: title,
                      video_provider: "youtube",
                    });
                  }
                  reportStatus("playing");
                } else if (data === YT_STATE.PAUSED) {
                  reportStatus("paused");
                } else if (data === YT_STATE.ENDED) {
                  reportStatus("ended");
                }
              },
            },
          });
          playerRef.current = player;

          stopWatchingRef.current = watchYouTubePlayback(player, {
            onProgress: (progress_percent) => {
              pushDataLayerEvent({
                event: "video_progress",
                video_name: title,
                video_provider: "youtube",
                progress_percent,
              });
            },
            onComplete: () => {
              pushDataLayerEvent({
                event: "video_complete",
                video_name: title,
                video_provider: "youtube",
              });
            },
          });
        });
      },
      stop: () => {
        const player = playerRef.current;
        if (player) {
          try {
            player.pauseVideo();
          } catch {
            // Player may already be destroyed.
          }
        } else {
          // A pause arrived before the async player finished building —
          // cancel the pending autoplay so it cannot start later.
          buildTokenRef.current++;
        }
      },
      getStatus: () => {
        const player = playerRef.current;
        if (!player || typeof player.getPlayerState !== "function") return "idle";
        const s = player.getPlayerState();
        if (s === YT_STATE.PLAYING) return "playing";
        if (s === YT_STATE.PAUSED) return "paused";
        if (s === YT_STATE.ENDED) return "ended";
        return "idle";
      },
    },
  });

  const phase = playbackState.phase;

  const destroyPlayer = useCallback(() => {
    buildTokenRef.current++;
    stopWatchingRef.current?.();
    stopWatchingRef.current = null;
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch {
        // Already destroyed.
      }
      playerRef.current = null;
    }
  }, []);

  // Autoplay once on mount — the hero's existing intentional behavior. The
  // request is delayed briefly so the router's scroll restoration / any
  // same-page anchor jump (Lenis smooth scroll) has time to settle. The
  // manager only starts a video that is actually in the viewport: if the
  // user arrives at the home page somewhere other than the hero (e.g. a
  // #section link or a restored mid-page scroll), the autoplay stays queued
  // and fires only when the hero scrolls into view.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      autoplay();
    }, 600);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Destroy the player when the video ends (session over; replay restarts).
  useEffect(() => {
    if (phase === "ended") destroyPlayer();
  }, [phase, destroyPlayer]);

  // Cleanup on unmount.
  useEffect(() => {
    return destroyPlayer;
  }, [destroyPlayer]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <div className="mb-3 flex items-center justify-between pl-1">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground sm:text-[11px]">
          REAL CLIENT WORK
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/60">01</span>
      </div>

      <div
        className="relative aspect-video w-full overflow-hidden rounded-[5px] border border-border/70 bg-[#101828] shadow-xs"
        aria-label={title}
      >
        <div ref={playerMountRef} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="mt-3 px-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground/90 sm:text-[10px]">
        CLIENT REVIEW · REAL PROJECT · 1:00
      </div>
    </div>
  );
}
