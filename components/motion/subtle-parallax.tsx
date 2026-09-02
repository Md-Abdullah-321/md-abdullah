"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useIsMobile } from "./reveal";

interface SubtleParallaxProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Total vertical drift in px across the element's viewport passage (5–20) */
  range?: number;
}

/**
 * Very slow vertical drift for existing background/decorative elements only —
 * never for text, buttons, or navigation. Disabled on mobile and under
 * reduced motion. Works with Lenis because Lenis drives the real window
 * scroll position.
 */
export function SubtleParallax({
  children,
  className,
  style,
  range = 16,
}: SubtleParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, range]);

  if (reduced || isMobile === true) {
    return (
      <div ref={ref} className={className} style={style} aria-hidden="true">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, y }}
      aria-hidden="true"
    >
      {children}
    </motion.div>
  );
}
