"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { easings } from "@/lib/motion";
import { useMounted } from "./reveal";

/**
 * Very subtle one-shot entrance on initial page load (opacity + 8px rise).
 * Rendered inside <main> in the marketing layout — it does not remount on
 * route changes (those use the template-level PageFade instead).
 *
 * SSR and the hydration render output plain children, so content is never
 * hidden for JS-disabled users. The transform only exists during the 0.6s
 * entrance and is removed on completion (no lingering containing block).
 */
export function PageEnter({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();

  if (!mounted || reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [...easings.out] }}
    >
      {children}
    </motion.div>
  );
}
