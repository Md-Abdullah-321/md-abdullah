"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmbedUrl, getThumbnailUrl } from "@/lib/videos/providers";
import { track } from "@/lib/analytics/client";
import { EVENTS } from "@/lib/analytics/events";
import type { VideoProvider, AspectRatio } from "@/types";

interface VideoEmbedProps {
  provider: VideoProvider;
  videoId: string;
  title: string;
  thumbnail?: string;
  aspectRatio?: AspectRatio;
  className?: string;
}

const aspectRatioClass: Record<AspectRatio, string> = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "9:16": "aspect-[9/16]",
};

/**
 * Lazy-loaded video embed. Shows a thumbnail with a play button.
 * Only loads the iframe when the user clicks to play.
 * Avoids loading heavy third-party resources until interaction.
 */
export function VideoEmbed({
  provider,
  videoId,
  title,
  thumbnail,
  aspectRatio = "16:9",
  className,
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    track(EVENTS.VIDEO_PLAYED, { provider, video_id: videoId });
  }, [provider, videoId]);

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
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
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
