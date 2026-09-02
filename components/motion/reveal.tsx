"use client";

/**
 * Scroll-reveal primitives.
 *
 * <Reveal>          — single element: opacity + tiny translate/scale as it
 *                     enters the viewport (or on mount when `inView={false}`).
 * <RevealGroup>     — stagger container; orchestrates nested <RevealItem>s.
 * <RevealItem>      — child of a group; inherits orchestration via variants.
 *
 * All three render a PLAIN element on the server and during the hydration
 * render, then swap to the motion element pre-paint (useMounted). This
 * guarantees content is never stuck invisible when JavaScript is disabled or
 * fails, and avoids hydration mismatches.
 *
 * Reduced motion: components render plain elements — no hidden states, no
 * transforms. Content simply appears.
 *
 * Mobile: reveal distances and stagger are reduced (see revealVariants) so
 * phones feel faster and closer to native.
 */

import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  useMemo,
  useSyncExternalStore,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  revealVariants,
  type RevealElementVariantName,
} from "@/lib/motion";

/* ─── Hydration gate ───────────────────────────────────
 * False on the server and during the hydration render, true on the first
 * post-hydration render (synchronously, before paint). Replaces the classic
 * useLayoutEffect-mounted pattern without setting state inside an effect.
 */
const emptySubscribe = () => () => {};

function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/* ─── Shared mobile media query (useSyncExternalStore) ── */
let mobileQuery: MediaQueryList | null = null;

function getMobileSnapshot(): boolean | null {
  if (typeof window === "undefined") return null;
  if (!mobileQuery) mobileQuery = window.matchMedia("(max-width: 767px)");
  return mobileQuery.matches;
}

function subscribeMobile(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (!mobileQuery) mobileQuery = window.matchMedia("(max-width: 767px)");
  const query = mobileQuery;
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function useIsMobile(): boolean | null {
  return useSyncExternalStore(subscribeMobile, getMobileSnapshot, () => null);
}

/* ─── Motion tags, created once at module level ────────
 * Creating components during render would reset their state on every render.
 */
type MotionTagComponent = ComponentType<Record<string, unknown>>;

const motionTag = (tag: string): MotionTagComponent =>
  motion.create(tag) as unknown as MotionTagComponent;

const motionTags = {
  div: motionTag("div"),
  section: motionTag("section"),
  article: motionTag("article"),
  aside: motionTag("aside"),
  header: motionTag("header"),
  footer: motionTag("footer"),
  h1: motionTag("h1"),
  h2: motionTag("h2"),
  h3: motionTag("h3"),
  p: motionTag("p"),
  span: motionTag("span"),
  ul: motionTag("ul"),
  ol: motionTag("ol"),
  li: motionTag("li"),
} as const;

type MotionTagName = keyof typeof motionTags;

interface BaseProps {
  as?: MotionTagName;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface RevealProps extends BaseProps {
  /** Reveal variant — movement is deliberately tiny (see lib/motion.ts) */
  variant?: RevealElementVariantName;
  /** Extra delay in seconds before the reveal starts */
  delay?: number;
  /** true = reveal when scrolled into view (default); false = animate on mount */
  inView?: boolean;
  /** Fraction of the element that must be visible to trigger (0–1) */
  amount?: number;
}

export function Reveal({
  as = "div",
  variant = "body",
  delay = 0,
  inView = true,
  amount = 0.2,
  className,
  style,
  children,
}: RevealProps) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const variants = useMemo(() => revealVariants(isMobile === true), [isMobile]);
  const Tag = motionTags[as];

  if (!mounted || reduced) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      style={style}
      custom={delay}
      variants={variants[variant] as Variants}
      initial="hidden"
      {...(inView
        ? { whileInView: "visible", viewport: { once: true, amount } }
        : { animate: "visible" })}
    >
      {children}
    </Tag>
  );
}

export interface RevealGroupProps extends BaseProps {
  /** Seconds between item reveals */
  stagger?: number;
  /** Seconds before the first item reveals */
  delayChildren?: number;
  inView?: boolean;
  amount?: number;
}

export function RevealGroup({
  as = "div",
  className,
  style,
  stagger = 0.06,
  delayChildren = 0,
  inView = true,
  amount = 0.2,
  children,
}: RevealGroupProps) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const variants = useMemo<Variants>(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: isMobile === true ? Math.min(stagger, 0.04) : stagger,
          delayChildren,
        },
      },
    }),
    [isMobile, stagger, delayChildren],
  );
  const Tag = motionTags[as];

  if (!mounted || reduced) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      {...(inView
        ? { whileInView: "visible", viewport: { once: true, amount } }
        : { animate: "visible" })}
    >
      {children}
    </Tag>
  );
}

export interface RevealItemProps extends BaseProps {
  variant?: RevealElementVariantName;
}

export function RevealItem({
  as = "div",
  variant = "item",
  className,
  style,
  children,
}: RevealItemProps) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const variants = useMemo(() => revealVariants(isMobile === true), [isMobile]);
  const Tag = motionTags[as];

  if (!mounted || reduced) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag className={className} style={style} variants={variants[variant] as Variants}>
      {children}
    </Tag>
  );
}

export { useMounted };
