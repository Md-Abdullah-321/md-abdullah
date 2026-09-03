import { TrackLink } from "@/components/analytics/track-link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HeroVideo } from "./hero-video";
import { UpworkProof } from "./upworkproof";

const ghlProof = [
  ["35+", "GHL SUBACCOUNTS", "MANAGED"],
  ["10+", "AGENCIES", "SUPPORTED"],
  ["10+", "A2P", "REGISTRATIONS"],
] as const;

/** Data for the UpworkProof card in the hero. Rendered only when present. */
export type HeroProofData = {
  id: string;
  quote: string;
  highlight: string | null;
  attribution: string;
};

export function Hero({
  proof,
  proofs,
}: {
  proof?: HeroProofData | null;
  /** Ordered collection of eligible hero testimonials (for auto-rotation). */
  proofs?: HeroProofData[] | null;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/70 bg-background pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
      <div
        className="pointer-events-none absolute -right-40 -top-52 -z-10 h-[32rem] w-[32rem] rounded-full bg-accent/40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-44 -left-40 -z-10 h-[26rem] w-[26rem] rounded-full bg-primary/[0.04]"
        aria-hidden="true"
      />
      <Container>
        <div className="grid items-center gap-x-8 gap-y-12 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)] lg:gap-x-10 xl:gap-x-[3.75rem]">
          {/* ── Left column · headline, CTA, Upwork proof ─────────────── */}
          <div className="flex flex-col">
            <Reveal
              variant="label"
              inView={false}
              delay={0}
              className="inline-flex items-center gap-3"
            >
              <span className="h-px w-[28px] bg-primary" aria-hidden="true" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/90 sm:text-[12px]">
                AUTOMATION &amp; INTEGRATION ENGINEER
              </span>
            </Reveal>

            <Reveal variant="heading" inView={false} delay={0.08}>
              <h1 className="mt-8 font-sans text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-[2.75rem] lg:text-[3rem] xl:text-[3.3rem]">
                <span className="block w-fit">I build systems</span>
                <span className="relative mt-1.5 block w-fit text-primary">
                  around your business.
                  <svg
                    className="pointer-events-none absolute -bottom-[0.14em] left-0 h-[0.24em] w-full text-primary/25"
                    viewBox="0 0 400 20"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 13C68 4 172 3 396 9"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </Reveal>

            <Reveal variant="body" inView={false} delay={0.16}>
              <p className="mt-7 max-w-[46ch] font-sans text-[1.0625rem] leading-[1.58] text-muted-foreground sm:text-[1.125rem]">
                I connect the tools your business already relies on, remove the
                manual handoffs, and build workflows that keep your team focused
                on decisions that matter.
              </p>
            </Reveal>

            <Reveal
              variant="body"
              inView={false}
              delay={0.24}
              className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3"
            >
              <Button size="lg" variant="primary" asChild>
                <TrackLink
                  href="/contact"
                  event={{
                    event: "cta_click",
                    cta_name: "start_a_conversation",
                    location: "hero",
                  }}
                >
                  Start a Conversation
                  <ArrowRight className="h-4 w-4" />
                </TrackLink>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <TrackLink
                  href="/work"
                  event={{
                    event: "cta_click",
                    cta_name: "see_my_work",
                    location: "hero",
                  }}
                >
                  See My Work
                  <ArrowUpRight className="h-4 w-4" />
                </TrackLink>
              </Button>
            </Reveal>

            <Reveal variant="body" inView={false} delay={0.24}>
              {proof ? (
                <UpworkProof
                  quote={proof.quote}
                  highlight={proof.highlight}
                  attribution={proof.attribution}
                  testimonials={proofs ?? null}
                  variant="hero"
                />
              ) : null}
            </Reveal>
          </div>

          {/* ── Right column · Real Client Work + GHL experience ──────── */}
          <div className="flex flex-col">
            <Reveal variant="media" inView={false} delay={0.16}>
              <HeroVideo
                videoId="avMXDXwstEE"
                title="Md Abdullah - Automation & Integration Systems Walkthrough"
              />
            </Reveal>

            <Reveal
              variant="body"
              inView={false}
              delay={0.3}
              className="mt-8"
            >
              {/* GHL experience — compact editorial credential signature */}
              <div className="flex items-center bg-surface-muted py-5 rounded-2xl shadow-sm">
                {ghlProof.map(([value, label, suffix], index) => {
                  const last = index === ghlProof.length - 1;
                  return (
                    <div
                      key={label}
                      className={
                        last
                          ? "min-w-0 flex-1 pl-5"
                          : "relative min-w-0 flex-1 pl-5"
                      }
                    >
                      {!last ? (
                        <span
                          className="absolute -right-px top-[6px] h-12 w-px bg-border/70"
                          aria-hidden="true"
                        />
                      ) : null}
                      <p className="flex items-baseline gap-1 font-sans text-[26px] font-semibold leading-none tracking-[-0.02em] text-foreground sm:text-[28px]">
                        {value}
                        <span
                          className="ml-1 h-[5px] w-[5px] rounded-full bg-primary"
                          aria-hidden="true"
                        />
                      </p>
                      <p className="mt-2.5 font-mono text-[10px] font-medium uppercase leading-[1.35] tracking-[0.16em] text-foreground/70 sm:text-[11px]">
                        {label}
                        <br />
                        {suffix}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
