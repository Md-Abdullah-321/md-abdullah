"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

/* ─── UpworkProof ──────────────────────────────────────── */
/*
 * The homepage "upworkproof" card — one component, three usages:
 * - Homepage hero, single testimonial: static proof-of-work copy
 * - Homepage hero, multiple testimonials: the dynamic testimonial region
 *   (quote → highlight → attribution) quietly auto-rotates through the
 *   ordered collection at a fixed interval.
 * - Project pages: the project's related testimonial (static, no rotation)
 *
 * Only the testimonial content rotates. The static proof elements
 * (Proof of work, UPWORK, Top Rated, 20+ clients, stars, 5.0) live outside
 * the transition boundary and never animate.
 *
 * The internal reveal (header → stars/quote → attribution) is identical on
 * every page so the card always feels part of the same animation system.
 */

export interface UpworkProofSlide {
  /** The client's testimonial quote (exact stored wording). */
  quote: string;
  /** Short phrase highlighted under the quote, e.g. "Would work with again". */
  highlight?: string | null;
  /** Footer line, e.g. "Latest project · GHL + Automation" or "Client · Company". */
  attribution: string;
}

interface UpworkProofProps {
  /** The testimonial quote shown in the card. */
  quote: string;
  /** Footer line, e.g. "Latest project · GHL + Automation" or "Client · Company". */
  attribution: string;
  /** Short phrase highlighted under the quote, e.g. "Would work with again". */
  highlight?: string | null;
  /** Presentation context: "hero" clamps the quote to a short preview
   *  (line-clamp), "detail" (default) shows the full testimonial. */
  variant?: "hero" | "detail";
  className?: string;
  /** Overrides for the quote paragraph, e.g. "max-w-none" for full width. */
  quoteClassName?: string;
  /** Ordered testimonials for the dynamic region. When two or more are
   *  provided the region auto-rotates through them, starting at the first
   *  (the currently selected homepage testimonial). Omit (or pass one) for
   *  the static single-testimonial usage on project detail pages. */
  testimonials?: UpworkProofSlide[] | null;
}

/** Time each testimonial stays visible before the subtle crossfade (~6.5s). */
const ROTATE_INTERVAL_MS = 6500;

export function UpworkProof({
  quote,
  attribution,
  highlight,
  variant = "detail",
  className,
  quoteClassName,
  testimonials,
}: UpworkProofProps) {
  const clamp = variant === "hero";

  // Single source of truth for the dynamic region. Flat props describe one
  // testimonial (project pages); `testimonials` — when present — is the
  // ordered homepage rotation starting at the currently selected one.
  const slides: UpworkProofSlide[] =
    testimonials && testimonials.length > 0
      ? testimonials
      : [{ quote, attribution, highlight: highlight ?? null }];
  const rotating = slides.length > 1;

  const [index, setIndex] = useState(0);
  // Hover-to-pause only applies to devices that actually hover (not touch).
  const [canHover, setCanHover] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () =>
      setPageHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const paused = (canHover && hovered) || pageHidden;

  // Recursive timeout — one timer per card, restarted on pause/resume and
  // cleaned up on unmount or when rotation is disabled.
  useEffect(() => {
    if (!rotating || paused) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, ROTATE_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [rotating, paused, slides.length, index]);

  const safeIndex = rotating ? index % slides.length : 0;

  // Slides stack in the same grid cell (col-start-1 row-start-1) so the row
  // height is always the tallest slide — the card never jumps between quotes.
  const slideTransitionClasses =
    "col-start-1 row-start-1 transition-[opacity,translate] duration-[var(--duration-moderate)] ease-[var(--ease-in-out)]";

  return (
    <aside
      className={cn(
        "relative mt-6 overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6",
        className
      )}
      aria-label="Upwork proof of work"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-accent/70"
        aria-hidden="true"
      />
      <RevealGroup className="relative" stagger={0.06}>
        <RevealItem className="flex items-start justify-between gap-5">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              Proof of work
            </p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-mono text-sm font-semibold tracking-[0.06em]">
                UPWORK
              </span>
              <span className="text-xs text-muted-foreground">Top Rated</span>
            </div>
          </div>
          <p className="font-mono text-xs text-muted-foreground">20+ clients</p>
        </RevealItem>

        <RevealItem className="mt-5 border-t border-border/70 pt-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg tracking-[0.08em] text-primary">
              ★★★★★
            </span>
            <span className="font-mono text-sm font-semibold">5.0</span>
          </div>

          {/* Dynamic: quote + highlight (single static slide = no rotation) */}
          <div className="mt-3 grid">
            {slides.map((slide, i) => {
              const isActive = i === safeIndex;
              return (
                <div
                  key={i}
                  aria-hidden={!isActive}
                  className={cn(
                    slideTransitionClasses,
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-1 opacity-0"
                  )}
                >
                  <p
                    className={cn(
                      clamp
                        ? "line-clamp-3 text-sm leading-relaxed text-foreground/85"
                        : "max-w-[38ch] text-sm leading-relaxed text-foreground/85",
                      quoteClassName
                    )}
                  >
                    &quot;{slide.quote}&quot;
                  </p>
                  {slide.highlight ? (
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check
                          className="h-2.5 w-2.5"
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="font-medium text-foreground/80">
                        {slide.highlight}
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </RevealItem>

        <RevealItem>
          {/* Dynamic: attribution (client · company) */}
          <div className="mt-4 grid">
            {slides.map((slide, i) => {
              const isActive = i === safeIndex;
              return (
                <p
                  key={i}
                  aria-hidden={!isActive}
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground/70",
                    slideTransitionClasses,
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-1 opacity-0"
                  )}
                >
                  {slide.attribution}
                </p>
              );
            })}
          </div>
        </RevealItem>
      </RevealGroup>
    </aside>
  );
}
