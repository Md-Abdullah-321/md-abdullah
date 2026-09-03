"use client";

import { useEffect } from "react";
import { pauseAllVideos } from "@/lib/videos/playback";
import type { ReactNode } from "react";

/**
 * Mounted inside app/(marketing)/template.tsx, which remounts on every
 * client-side navigation. On unmount it pauses whatever video is currently
 * playing, so an iframe/player from the outgoing page never keeps playing
 * audio during or after the route transition. Individual video components
 * also clean themselves up on unmount; this guarantees the pause happens
 * even if a player outlives its page subtree.
 */
export function VideoPlaybackGuard({ children }: { children: ReactNode }) {
  useEffect(() => {
    return () => {
      pauseAllVideos();
    };
  }, []);

  return <>{children}</>;
}
