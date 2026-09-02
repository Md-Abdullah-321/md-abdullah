"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

/* ─── UpworkProof ──────────────────────────────────────── */
/*
 * The homepage "upworkproof" card — one component, two usages:
 * - Homepage hero: static proof-of-work copy
 * - Project pages: the project's related testimonial
 *
 * The internal reveal (header → stars/quote → attribution) is identical on
 * both pages so the card always feels part of the same animation system.
 */

interface UpworkProofProps {
  /** The testimonial quote shown in the card. */
  quote: string;
  /** Footer line, e.g. "Latest project · GHL + Automation" or "Client · Company". */
  attribution: string;
  className?: string;
  /** Overrides for the quote paragraph, e.g. "max-w-none" for full width. */
  quoteClassName?: string;
}

export function UpworkProof({
  quote,
  attribution,
  className,
  quoteClassName,
}: UpworkProofProps) {
  return (
    <aside
      className={cn(
        "relative mt-6 overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6",
        className
      )}
      aria-label="Upwork proof of work"
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
          <p
            className={cn(
              "mt-3 max-w-[38ch] text-sm leading-relaxed text-foreground/85",
              quoteClassName
            )}
          >
            &quot;{quote}&quot;
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check
                className="h-2.5 w-2.5"
                strokeWidth={3}
                aria-hidden="true"
              />
            </span>
            <span className="font-medium text-foreground/80">
              Would work with again
            </span>
          </div>
        </RevealItem>
        <RevealItem>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground/70">
            {attribution}
          </p>
        </RevealItem>
      </RevealGroup>
    </aside>
  );
}
