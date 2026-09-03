"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmbedUrl, getThumbnailUrl } from "@/lib/videos/providers";
import { track } from "@/lib/analytics/client";
import { EVENTS } from "@/lib/analytics/events";
import { pushDataLayerEvent } from "@/lib/analytics/data-layer";
import {
  loadYouTubeApi,
  watchYouTubePlayback,
  YOUTUBE_NOCOOKIE_HOST,
  YT_STATE,
  type YouTubePlayer,
} from "@/lib/videos/youtube";
import type { VideoProvider, AspectRatio } from "@/types";
import { useVideoPlayer } from "@/hooks/use-video-controller";

interface VideoEmbedProps {
  provider: VideoProvider;
  videoId: string;
  title: string;
  thumbnail?: string;
  aspectRatio?: AspectRatio;
  className?: string;
  /** Optional project context, pushed alongside video events when present. */
  projectName?: string;
  projectSlug?: string;
}

const aspectRatioClass: Record<AspectRatio, string> = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "9:16": "aspect-[9/16]",
};

/**
 * Lazy-loaded video embed. Shows a thumbnail with a play button.
 * Only loads the player when the user clicks to play.
 *
 * YouTube embeds are created through the official YouTube IFrame API so the
 * site can push dataLayer video_play / video_progress / video_complete events.
 * Loom has no public embed player API, so Loom videos only report
 * video_play — the site deliberately avoids polling third-party iframes for
 * progress, so Loom milestones cannot be observed reliably.
 *
 * Playback policy (single active video, pause-on-scroll, no auto-resume) is
 * centralized in the global playback manager. This component only implements
 * provider mechanics and analytics:
 *
 * - A YouTube player, once built, stays mounted while this video is paused
 *   (by the user, by the manager for visibility, or because another video
 *   started). Keeping it mounted preserves the playback position and the
 *   progress-milestone session across pauses.
 * - Whenever the video is not actively playing, the thumbnail + play button
 *   covers the container. The only way to start is a click on that button,
 *   which routes through the manager — native YouTube controls can never
 *   start a second video or resume one behind the manager's back.
 * - When the video ends, the player is destroyed so the milestone watcher
 *   session closes; a replay starts a fresh session (existing behavior).
 * - Loom embeds are plain iframes and cannot be paused programmatically, so
 *   they are mounted only while playing — unmounting is the only reliable
 *   stop. A resumed Loom video restarts from the beginning.
 */
export function VideoEmbed({
  provider,
  videoId,
  title,
  thumbnail,
  aspectRatio = "16:9",
  className,
  projectName,
  projectSlug,
}: VideoEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerMountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const stopWatchingRef = useRef<(() => void) | null>(null);
  // Invalidates an in-flight async player build (pause before ready, etc.).
  const buildTokenRef = useRef(0);

  const { playbackState, play, reportStatus } = useVideoPlayer({
    provider,
    videoId,
    rootRef: containerRef,
    player: {
      start: () => {
        const token = ++buildTokenRef.current;

        // Resume an already-built player.
        if (playerRef.current) {
          try {
            playerRef.current.playVideo();
          } catch {
            // Player may be gone; fall through to a fresh build below.
          }
          return;
        }

        if (provider === "youtube") {
          loadYouTubeApi().then((YouTube) => {
            if (token !== buildTokenRef.current) return;
            if (!playerMountRef.current) return;

            const player = new YouTube.Player(playerMountRef.current, {
              videoId,
              host: YOUTUBE_NOCOOKIE_HOST,
              playerVars: {
                autoplay: 1,
                enablejsapi: 1,
                origin: window.location.origin,
                rel: 0,
              },
              events: {
                onStateChange: ({ data }) => {
                  if (data === YT_STATE.PLAYING) reportStatus("playing");
                  else if (data === YT_STATE.PAUSED) reportStatus("paused");
                  else if (data === YT_STATE.ENDED) reportStatus("ended");
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
                  project_name: projectName,
                  project_slug: projectSlug,
                });
              },
              onComplete: () => {
                pushDataLayerEvent({
                  event: "video_complete",
                  video_name: title,
                  video_provider: "youtube",
                  project_name: projectName,
                  project_slug: projectSlug,
                });
              },
            });
          });
        } else {
          // Loom: the iframe mounts (and autoplays) once the controller
          // reports "playing"; it reports only video_play (see module doc).
          reportStatus("playing");
        }
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
          // cancel the pending build so it cannot autoplay later.
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

  // Thumbnail covers the container whenever the video is not actively
  // playing. A mounted-but-paused player sits underneath, covered by the
  // overlay so the only way back in is through the manager.
  //
  // IMPORTANT: the YouTube mount element must never be hidden (opacity-0 /
  // display-none) while the player is created. The IFrame API reads its
  // container's opacity at init and bakes it into the player, leaving a
  // playing-but-invisible iframe. The player is always built into a fully
  // visible element; the click-to-play overlay covers it instead.
  const showThumbnail = phase !== "playing";

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

  // Destroy the player when the video ends — the session is over and a
  // replay should start a fresh milestone session.
  useEffect(() => {
    if (phase === "ended") destroyPlayer();
  }, [phase, destroyPlayer]);

  // Cleanup on unmount.
  useEffect(() => {
    return destroyPlayer;
  }, [destroyPlayer]);

  const handlePlay = useCallback(() => {
    // A brand-new play session (no player built yet) reports video_play.
    // Resuming a paused video (player still mounted) is a continuation of
    // the same session — no duplicate video_play event.
    if (!playerRef.current) {
      track(EVENTS.VIDEO_PLAYED, { provider, video_id: videoId });
      pushDataLayerEvent({
        event: "video_play",
        video_name: title,
        video_provider: provider,
        project_name: projectName,
        project_slug: projectSlug,
      });
    }
    play();
  }, [provider, videoId, title, projectName, projectSlug, play]);

  const thumbUrl = thumbnail || getThumbnailUrl(provider, videoId);
  const embedUrl = getEmbedUrl(provider, videoId, { autoplay: true });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-lg bg-muted",
        aspectRatioClass[aspectRatio],
        className
      )}
    >
      {/* YouTube player mount — ALWAYS fully visible. The player is built
          imperatively once the manager grants playback; the click-to-play
          overlay covers it while it is not actively playing. The element is
          never opacity-hidden, because the YouTube IFrame API reads the
          container's opacity at creation and would render the player
          invisible (audio-only) if it were hidden at build time. */}
      {provider === "youtube" && (
        <div ref={playerMountRef} className="absolute inset-0 h-full w-full" />
      )}

      {/* Loom iframe — mounted only while playing (no programmatic pause). */}
      {provider === "loom" && phase === "playing" && (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      )}

      {/* Click-to-play overlay — thumbnail before first play, re-entry after
          any pause. Every start routes through the global manager. */}
      {showThumbnail && (
        <button
          type="button"
          onClick={handlePlay}
          className="group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Play video: ${title}`}
        >
          {/* Thumbnail */}
          <Image
            src={thumbUrl}
            alt={`Thumbnail for ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
            className="object-cover transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out)] group-hover:scale-[1.02]"
          />

          {/* Play button overlay */}
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-md transition-transform duration-[var(--duration-fast)] ease-[var(--ease-spring)] group-hover:scale-110">
            <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
          </div>

          {/* Subtle dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/10 transition-opacity duration-[var(--duration-normal)] group-hover:bg-black/20" />
        </button>
      )}
    </div>
  );
}
