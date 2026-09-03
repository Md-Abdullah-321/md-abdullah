import type { ReactNode } from "react";
import { PageFade } from "@/components/motion/page-fade";
import { VideoPlaybackGuard } from "@/components/motion/video-playback-guard";

/**
 * Remounts on every navigation within the marketing group, giving each route
 * change an extremely short fade (0.25s, opacity-only). Initial page load is
 * skipped — PageEnter in the layout covers it.
 *
 * VideoPlaybackGuard pauses any playing video when this template unmounts
 * (i.e. when navigating to another route), so no player from the outgoing
 * page keeps playing.
 */
export default function MarketingTemplate({ children }: { children: ReactNode }) {
  return (
    <VideoPlaybackGuard>
      <PageFade>{children}</PageFade>
    </VideoPlaybackGuard>
  );
}
