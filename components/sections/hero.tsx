import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { HeroVideo } from "./hero-video";

const process = [
  ["01", "Map the process"],
  ["02", "Connect the tools"],
  ["03", "Automate the routine"],
  ["04", "Keep people in control"],
] as const;

function UpworkProof() {
  return (
    <aside
      className="relative mt-6 overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6"
      aria-label="Upwork proof of work"
    >
      <div
        className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-accent/70"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-5">
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
          <p className="font-mono text-xs text-muted-foreground">10+ clients</p>
        </div>
        <div className="mt-5 border-t border-border/70 pt-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg tracking-[0.08em] text-primary">
              ★★★★★
            </span>
            <span className="font-mono text-sm font-semibold">5.0</span>
          </div>
          <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-foreground/85">
            &quot;His communication is excellent...&quot;
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
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground/70">
          Latest project · GHL + Automation
        </p>
      </div>
    </aside>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/70 bg-background pt-8 pb-10 sm:pt-12 sm:pb-14 lg:pt-16 lg:pb-14">
      <div
        className="pointer-events-none absolute -right-44 -top-56 -z-10 h-[34rem] w-[34rem] rounded-full bg-primary/[0.055]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-52 -left-44 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent/55"
        aria-hidden="true"
      />
      <div
        className="dot-grid pointer-events-none absolute right-8 top-10 -z-10 h-28 w-28 opacity-40 [mask-image:radial-gradient(circle,black,transparent_72%)]"
        aria-hidden="true"
      />
      <svg
        className="pointer-events-none absolute -right-2 top-20 -z-10 h-56 w-56 text-primary/[0.13]"
        viewBox="0 0 220 220"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 190C68 180 86 136 106 92C126 48 151 20 214 12"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M42 218C95 196 111 151 131 104C151 57 171 32 220 24"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
      <Container>
        <div className="relative grid items-start gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-14 xl:gap-20">
          <div className="flex flex-col gap-6 lg:pt-6">
            <div className="flex flex-col gap-5">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-primary" aria-hidden="true" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.09em] text-foreground/90 sm:text-[12px]">
                  AUTOMATION &amp; INTEGRATION ENGINEER
                </span>
              </div>
              <h1 className="font-mono text-[2.8rem] font-semibold leading-[0.96] tracking-[-0.035em] text-foreground text-balance sm:text-[4rem] lg:text-[5rem]">
                Make the
                <br />
                work move.
              </h1>
              <p className="max-w-[50ch] font-sans text-[1.0625rem] leading-[1.62] text-muted-foreground sm:text-[1.125rem]">
                I connect the tools your business already relies on, remove the
                manual handoffs, and build workflows that keep your team focused
                on decisions that matter.
              </p>
              <div className="flex flex-col items-stretch gap-3 pt-1 sm:flex-row sm:items-center">
                <Button size="lg" variant="primary" asChild>
                  <Link href="/contact">
                    Start a Conversation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/work">
                    See My Work
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 border-y border-border/80 sm:grid-cols-4">
              {process.map(([number, label], index) => (
                <div
                  key={number}
                  className={`relative py-3 pr-3 sm:px-4 sm:py-4 ${index > 0 ? "pl-3 sm:border-l sm:border-border/80" : ""}`}
                >
                  <p className="font-mono text-[10px] font-semibold text-primary">
                    {number}
                  </p>
                  <p className="mt-1.5 max-w-[12ch] text-xs leading-snug text-foreground/75">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative lg:pt-1">
            <div
              className="absolute -inset-5 -z-10 rounded-[1.5rem] border border-primary/[0.08] bg-accent/[0.12]"
              aria-hidden="true"
            />
            <HeroVideo
              videoId="avMXDXwstEE"
              title="Md Abdullah - Automation & Integration Systems Walkthrough"
            />
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
              A quick look at how I think about systems, handoffs, and the work
              between the tools.
            </p>
            <UpworkProof />
          </div>
          <div className="mt-0 border-t border-border/40 pt-4 lg:col-span-2">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/75 sm:text-[11px]">
              <span>TOP RATED ON UPWORK</span>
              <span>20+ CLIENTS</span>
              <span>GHL</span>
              <span>N8N</span>
              <span>APIs</span>
              <span>AI AUTOMATION</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
