"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmbedUrl, getThumbnailUrl } from "@/lib/videos/providers";
import { track } from "@/lib/analytics/client";
import { EVENTS } from "@/lib/analytics/events";
import { pushDataLayerEvent } from "@/lib/analytics/data-layer";
import { loadYouTubeApi, watchYouTubePlayback, YOUTUBE_NOCOOKIE_HOST, type YouTubePlayer } from "@/lib/videos/youtube";
import type { VideoProvider, AspectRatio } from "@/types";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const playerMountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    track(EVENTS.VIDEO_PLAYED, { provider, video_id: videoId });
    pushDataLayerEvent({
      event: "video_play",
      video_name: title,
      video_provider: provider,
      project_name: projectName,
      project_slug: projectSlug,
    });
  }, [provider, videoId, title, projectName, projectSlug]);

  // Create the YouTube player through the IFrame API only after the user
  // clicks play, and watch it for progress milestones / completion.
  useEffect(() => {
    if (provider !== "youtube" || !isPlaying || !playerMountRef.current) return;

    let disposed = false;
    let stopWatching: (() => void) | null = null;

    loadYouTubeApi().then((YouTube) => {
      if (disposed || !playerMountRef.current) return;

      const player = new YouTube.Player(playerMountRef.current, {
        videoId,
        host: YOUTUBE_NOCOOKIE_HOST,
        playerVars: {
          autoplay: 1,
          enablejsapi: 1,
          origin: window.location.origin,
          rel: 0,
        },
        events: {},
      });
      playerRef.current = player;

      stopWatching = watchYouTubePlayback(player, {
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

    return () => {
      disposed = true;
      stopWatching?.();
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [provider, videoId, isPlaying, title, projectName, projectSlug]);

  const thumbUrl = thumbnail || getThumbnailUrl(provider, videoId);
  const embedUrl = getEmbedUrl(provider, videoId, { autoplay: true });

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg bg-muted",
        aspectRatioClass[aspectRatio],
        className
      )}
    >
      {isPlaying ? (
        provider === "youtube" ? (
          <div ref={playerMountRef} className="absolute inset-0 h-full w-full" />
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        )
      ) : (
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
