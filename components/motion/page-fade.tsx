"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useMounted } from "./reveal";

/** True after the very first page mount — initial load is covered by PageEnter. */
let firstMountDone = false;

/**
 * Extremely short fade between route changes, used by app/(marketing)/template.tsx
 * which remounts on every navigation.
 *
 * Opacity-only — no transform, so fixed-position descendants (e.g. the hero
 * video modal) are never trapped inside a containing block.
 */
export function PageFade({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const [animateOnMount] = useState(() => firstMountDone);
  useEffect(() => {
    firstMountDone = true;
  }, []);
  const reduced = useReducedMotion();

  if (!mounted || reduced || !animateOnMount) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
