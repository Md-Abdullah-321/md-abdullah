"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { easings } from "@/lib/motion";

/**
 * Global Motion defaults for the marketing site:
 * - reducedMotion="user": transforms are disabled automatically for users
 *   who prefer reduced motion (Reveal components also render plain elements).
 * - Default ease matches the CSS --ease-out token (power2.out-like).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [...easings.out] }}>
      {children}
    </MotionConfig>
  );
}
