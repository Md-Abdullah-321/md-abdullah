import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { HeroVideo } from "./hero-video";

export function Hero() {
  return (
    <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-[100px] lg:pb-[90px] border-b border-border/70">
      <Container>
        <div className="flex flex-col lg:grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 xl:gap-24 items-start">
          {/* ─── Left: Editorial Content (52% on desktop) ─ */}
          <div className="flex flex-col gap-5 lg:gap-6 lg:pr-2 order-1 lg:order-none">
            <div className="flex flex-col gap-5">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                <span className="font-mono text-[11px] sm:text-[12px] font-semibold tracking-[0.1em] uppercase text-foreground/90">
                  AUTOMATION &amp; INTEGRATION ENGINEER
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-mono text-[1.85rem] sm:text-[2.25rem] lg:text-[2.6rem] font-semibold leading-[1.14] tracking-[-0.025em] text-foreground text-balance max-w-[30ch]">
                I connect the systems your business depends on.
              </h1>

              {/* Supporting Text */}
              <p className="font-sans text-[1.0625rem] sm:text-[1.125rem] leading-[1.6] text-muted-foreground max-w-[52ch]">
                Your CRM, forms, calendars, payments and other tools should work together. I build the integrations, automation and AI workflows that connect them and keep work moving.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
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
          </div>

          {/* ─── Right: Proof Video Frame (48% on desktop) ─ */}
          <div className="w-full lg:pt-0 order-2 lg:order-none">
            <HeroVideo
              videoId="avMXDXwstEE"
              title="Md Abdullah - Automation & Integration Systems Walkthrough"
            />
          </div>

          {/* ─── Proof Strip (Bottom row) ─ */}
          <div className="order-3 lg:order-none lg:col-span-2 mt-2 lg:mt-[-2rem] border-t border-border/40 pt-6">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-muted-foreground/80">
              <span>TOP RATED ON UPWORK</span>
              <span>10+ CLIENTS</span>
              <span>GHL</span>
              <span>n8n</span>
              <span>APIs</span>
              <span>AI AUTOMATION</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


