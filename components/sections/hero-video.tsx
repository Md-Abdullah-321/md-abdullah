"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroVideoProps {
  videoId?: string;
  title?: string;
  className?: string;
}

export function HeroVideo({
  videoId = "avMXDXwstEE",
  title = "Md Abdullah - Automation & Integration Systems Walkthrough",
  className,
}: HeroVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  const thumbnailUrl = `/images/client-testimonial-thumbnail.jpg`;

  return (
    <div className={cn("w-full", className)}>
      {/* ─── Optional Editorial Label ─────────────── */}
      <div className="mb-3 flex items-center justify-between pl-1">
        <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-foreground">
          REAL CLIENT WORK
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/60">
          01
        </span>
      </div>

      {/* ─── Video Frame ────────────────────────────── */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/60 bg-surface shadow-sm transition-[border-color,box-shadow] hover:border-border">
        {isPlaying ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="group relative flex h-full w-full cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Play video: ${title}`}
          >
            {/* Thumbnail Poster */}
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 640px"
              priority
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015]"
            />

            {/* Subtle Gradient Veil for contrast */}
            <div
              className="absolute inset-0 bg-black/25 transition-opacity duration-200 group-hover:bg-black/35"
              aria-hidden="true"
            />

            {/* Custom Play Button Overlay with Brand Purple Accent */}
            <div className="relative z-10 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-[transform,background-color] duration-200 ease-out group-hover:scale-105 group-hover:bg-primary/95 group-active:scale-95">
              <Play className="h-6 w-6 translate-x-0.5 fill-current text-white" aria-hidden="true" />
            </div>

            {/* Bottom-left video metadata tag */}
            <div className="absolute bottom-4 left-4 z-10 rounded bg-black/60 px-2.5 py-1.5 font-mono text-[10px] text-white backdrop-blur-md">
              GoHighLevel + Automation
            </div>
          </button>
        )}
      </div>

      {/* ─── Technical Caption Below Video ───────────── */}
      <div className="mt-3 flex items-center justify-between px-1 font-mono text-[9.5px] sm:text-[10px] uppercase tracking-[0.1em] text-muted-foreground/90">
        <span>CLIENT REVIEW · REAL PROJECT · 1:00</span>
      </div>
    </div>
  );
}
