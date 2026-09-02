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

/** Viewport preset for scroll-triggered reveals (see components/motion/reveal.tsx) */
export const viewportOnce = { once: true, amount: 0.2 } as const;

export type RevealVariantName =
  | "label"
  | "heading"
  | "body"
  | "media"
  | "section"
  | "item"
  | "container";

/** Variant names usable on single elements (everything except the stagger container) */
export type RevealElementVariantName = Exclude<RevealVariantName, "container">;

/**
 * Scroll-reveal variants.
 *
 * Movement is intentionally tiny (0–16px / 0.985→1 scale) so content feels
 * like it settles into place rather than animating onto the screen.
 *
 * `isMobile` reduces distances and stagger so phones feel faster and native.
 * `visible` is a function so callers can pass a per-instance delay via
 * `custom` (e.g. hero sequencing) without breaking variant orchestration.
 */
export function revealVariants(isMobile = false) {
  const d = isMobile ? 0.6 : 1;
  const visible = (delay = 0, duration: number = durations.slow) => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration, ease: easings.out, delay },
  });

  return {
    label: {
      hidden: { opacity: 0, x: -(5 * d) },
      visible: (delay: number = 0) => visible(delay, durations.moderate),
    },
    heading: {
      hidden: { opacity: 0, y: 15 * d },
      visible: (delay: number = 0) => visible(delay, durations.slow),
    },
    body: {
      hidden: { opacity: 0, y: 10 * d },
      visible: (delay: number = 0) => visible(delay, durations.moderate),
    },
    media: {
      hidden: { opacity: 0, scale: 1 - 0.015 * d },
      visible: (delay: number = 0) => visible(delay, durations.slow),
    },
    section: {
      hidden: { opacity: 0, y: 16 * d },
      visible: (delay: number = 0) => visible(delay, durations.slow),
    },
    item: {
      hidden: { opacity: 0, y: 8 * d },
      visible: (delay: number = 0) => visible(delay, durations.normal),
    },
    container: {
      hidden: {},
      visible: {
        transition: { staggerChildren: isMobile ? 0.04 : 0.06 },
      },
    },
  } as const;
}
