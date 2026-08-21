/**
 * Motion conventions for the portfolio.
 *
 * Usage with the `motion` package:
 *   import { motion } from "motion/react";
 *   import { transitions, durations } from "@/lib/motion";
 *
 *   <motion.div
 *     initial={{ opacity: 0, y: 12 }}
 *     animate={{ opacity: 1, y: 0 }}
 *     transition={transitions.normal}
 *   />
 *
 * CSS variables (defined in globals.css) mirror these values for
 * plain CSS transitions:
 *   transition: transform var(--duration-normal) var(--ease-out);
 */

/** Duration constants (seconds) */
export const durations = {
  fast: 0.15,
  normal: 0.25,
  moderate: 0.4,
  slow: 0.7,
} as const;

/** Easing curves for Motion (framer-motion syntax) */
export const easings = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  spring: { type: "spring", stiffness: 300, damping: 24 } as const,
} as const;

/** Pre-built transition presets */
export const transitions = {
  fast: { duration: durations.fast, ease: easings.out },
  normal: { duration: durations.normal, ease: easings.out },
  moderate: { duration: durations.moderate, ease: easings.inOut },
  slow: { duration: durations.slow, ease: easings.inOut },
  spring: easings.spring,
} as const;

/** Common animation variants for staggered children */
export const stagger = {
  container: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.normal,
    },
  },
} as const;

/** Fade-up animation variant (single element) */
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.moderate,
  },
} as const;
