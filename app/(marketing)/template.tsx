import type { ReactNode } from "react";
import { PageFade } from "@/components/motion/page-fade";

/**
 * Remounts on every navigation within the marketing group, giving each route
 * change an extremely short fade (0.25s, opacity-only). Initial page load is
 * skipped — PageEnter in the layout covers it.
 */
export default function MarketingTemplate({ children }: { children: ReactNode }) {
  return <PageFade>{children}</PageFade>;
}
