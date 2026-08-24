"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroVideoProps {
  videoId?: string;
  title?: string;
  className?: string;
}

type YouTubePlayer = {
  destroy: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  setVolume: (volume: number) => void;
  unMute: () => void;
};

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady: (event: { target: YouTubePlayer }) => void;
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

function loadYouTubeApi() {
  if (window.YT) return Promise.resolve(window.YT);

  return new Promise<YouTubeApi>((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      if (window.YT) resolve(window.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

export function HeroVideo({
  videoId = "avMXDXwstEE",
  title = "Md Abdullah - Automation & Integration Systems Walkthrough",
  className,
}: HeroVideoProps) {
  const previewRef = useRef<HTMLButtonElement>(null);
  const playerMountRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const thumbnailUrl = "/images/client-testimonial-thumbnail.jpg";

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !playerMountRef.current) return;
    let disposed = false;

    loadYouTubeApi().then((YouTube) => {
      if (disposed || !playerMountRef.current) return;

      playerRef.current = new YouTube.Player(playerMountRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          cc_load_policy: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          origin: window.location.origin,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: ({ target }) => {
            target.unMute();
            target.setVolume(100);
            target.playVideo();
          },
        },
      });
    });

    return () => {
      disposed = true;
      playerRef.current?.pauseVideo();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [isOpen, videoId]);

  function closeModal() {
    setIsOpen(false);
    previewRef.current?.focus();
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex items-center justify-between pl-1">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground sm:text-[11px]">
          REAL CLIENT WORK
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/60">01</span>
      </div>

      <button
        ref={previewRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative block aspect-video w-full overflow-hidden rounded-[5px] border border-border/70 bg-[#101828] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Open video: ${title}`}
      >
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 640px"
          priority
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.01]"
        />
        <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" aria-hidden="true" />
        <span className="absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-90 transition-[opacity,transform] duration-150 group-hover:scale-105 group-hover:opacity-100 sm:h-14 sm:w-14">
          <Play className="h-5 w-5 translate-x-0.5 fill-current text-white sm:h-6 sm:w-6" aria-hidden="true" />
        </span>
      </button>

      <div className="mt-3 px-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground/90 sm:text-[10px]">
        CLIENT REVIEW · REAL PROJECT · 1:00
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101828]/80 p-4 backdrop-blur-[2px] sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="relative aspect-video w-[min(1100px,calc(100vw-32px))] overflow-hidden rounded-xl border border-white/15 bg-[#101828] sm:w-[min(1100px,calc(100vw-64px))]">
            <div ref={playerMountRef} className="absolute inset-0 h-full w-full" />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#101828]/65 text-white/80 transition-colors hover:bg-[#101828] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close video"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
