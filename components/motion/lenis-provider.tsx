"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export { useLenis } from "lenis/react";

/**
 * Subtle smooth scrolling for the marketing site (companion rules live in
 * globals.css). Lenis drives the real window scroll position, so Motion's
 * useScroll / whileInView stay in sync with no extra wiring.
 *
 * - lerp 0.09 keeps the wheel feeling immediate, not floaty.
 * - Touch stays native (syncTouch: false) — mobile scrolls exactly as before.
 * - `anchors` handles same-page hash links; cross-page hashes fall through to
 *   the Next router untouched.
 * - Reduced motion: Lenis respects prefers-reduced-motion natively and falls
 *   back to plain native scrolling.
 * - Scroll-locking overlays (video modal, mobile menu) opt out via
 *   `data-lenis-prevent`, which Lenis checks natively.
 *
 * `root` renders children without a wrapper element, so the layout's flex
 * column stays untouched.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        syncTouch: false,
        anchors: true,
        autoRaf: true,
        stopInertiaOnNavigate: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
