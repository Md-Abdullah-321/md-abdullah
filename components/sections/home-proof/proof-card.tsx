"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ContactLink } from "@/components/analytics/contact-link";

export type ProofQuote = {
  id: string;
  quote: string;
  attribution: string;
};

const ROTATE_MS = 6500;

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

function usePageHidden() {
  return useSyncExternalStore(
    (onChange) => {
      document.addEventListener("visibilitychange", onChange);
      return () => document.removeEventListener("visibilitychange", onChange);
    },
    () => document.visibilityState === "hidden",
    () => false
  );
}

export function ProofCard({
  quotes,
  upworkUrl,
}: {
  quotes: ProofQuote[];
  upworkUrl: string | null;
}) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const reduced = usePrefersReducedMotion();
  const hidden = usePageHidden();
  const paused = hidden || (userPaused ?? reduced);

  useEffect(() => {
    if (paused || quotes.length < 2) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % quotes.length);
    }, ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [paused, quotes.length, index]);

  const safe = quotes.length === 0 ? 0 : index % quotes.length;

  return (
    <div className="relative overflow-hidden rounded-[10px] border border-border bg-white px-6 pt-7 pb-5 sm:px-[30px]">
      <div
        className="pointer-events-none absolute -top-14 -right-14 h-40 w-40 rounded-full bg-primary/10"
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-green-deep">
            PROOF OF WORK
          </p>
          <p className="mt-2 font-mono text-[15px] font-bold tracking-[0.06em]">
            UPWORK
            <span className="ml-2.5 rounded-full border border-border bg-background px-2 py-0.5 font-sans text-[12.5px] font-medium tracking-normal text-muted-foreground">
              Top Rated
            </span>
          </p>
        </div>
        <p className="font-mono text-xs text-muted-foreground">20+ clients</p>
      </div>
      <hr className="my-[22px] border-0 border-t border-border" />
      <p className="flex items-center gap-2.5 font-mono text-[13px] font-semibold">
        <span className="tracking-[2px] text-primary" aria-label="5 out of 5 stars">
          ★★★★★
        </span>
        5.0
      </p>
      <div className="relative mt-3.5 grid min-h-28" aria-live="polite">
        {quotes.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">Reviews will appear here.</p>
        ) : (
          quotes.map((quote, i) => {
            const on = i === safe;
            return (
              <blockquote
                key={quote.id}
                className={`col-start-1 row-start-1 text-[19px] leading-snug tracking-[-0.01em] text-foreground ${on ? "" : "invisible"}`}
                aria-hidden={!on}
              >
                <p className="line-clamp-4">&ldquo;{quote.quote}&rdquo;</p>
                <footer className="mt-3.5 font-mono text-[11px] tracking-[0.1em] text-ink-faint uppercase not-italic">
                  {quote.attribution}
                </footer>
              </blockquote>
            );
          })
        )}
      </div>
      <hr className="my-[22px] border-0 border-t border-border" />
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            className="inline-flex h-[30px] items-center gap-1.5 rounded-[5px] border border-border px-2.5 font-mono text-[11.5px] text-foreground/80 hover:border-foreground"
            aria-pressed={paused}
            onClick={() => setUserPaused(!paused)}
          >
            {paused ? (
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2 1.5v7l6-3.5z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <rect x="1" y="1" width="3" height="8" fill="currentColor" />
                <rect x="6" y="1" width="3" height="8" fill="currentColor" />
              </svg>
            )}
            <span>{paused ? "Play" : "Pause"}</span>
          </button>
          {quotes.length > 1 ? (
            <div className="flex gap-1.5" role="group" aria-label="Reviews">
              {quotes.map((quote, i) => (
                <button
                  key={quote.id}
                  type="button"
                  aria-label={`Quote ${i + 1}`}
                  aria-pressed={i === safe}
                  className={`h-[3px] w-[18px] rounded-sm ${i === safe ? "bg-foreground" : "bg-border"}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          ) : null}
          <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-green-deep">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            100% Job Success
          </span>
        </div>
        {upworkUrl ? (
          <ContactLink
            href={upworkUrl}
            contactMethod="upwork"
            location="home_proof"
            external
            className="border-b border-border pb-0.5 font-mono text-[12.5px] text-foreground hover:border-primary hover:text-green-deep"
          >
            Read reviews on Upwork <span aria-hidden="true">↗</span>
          </ContactLink>
        ) : null}
      </div>
      {reduced ? <span className="sr-only">Review rotation is paused.</span> : null}
    </div>
  );
}
