import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Display, BodyLarge } from "@/components/ui/typography";
import { HeroSystemDesktop, HeroSystemMobile } from "./hero-system";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-10 md:pt-16 md:pb-14 lg:pt-20 lg:pb-16">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-0 right-1/4 h-[350px] w-[350px] -translate-y-1/4 rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <Container className="max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-8 xl:gap-12">
          {/* ─── Left: Content (48%) ────────────────── */}
          <div className="flex flex-col gap-5 lg:w-[46%] lg:shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-primary/40" aria-hidden="true" />
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Automation &amp; Integration Engineer
              </span>
            </div>

            <Display as="h1" className="max-w-[580px]">
              I connect your systems so your business runs without you holding it together
            </Display>

            <BodyLarge className="max-w-[520px] text-muted-foreground">
              Leads come in from your website. Someone updates the CRM. Someone
              sends the follow-up. When those steps depend on people remembering
              what to do, things get missed. I connect and automate those steps
              so the work keeps moving.
            </BodyLarge>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Start a Conversation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/work">
                  See My Work
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* ─── Right: Desktop graph (52%) ─────────── */}
          <div className="hidden min-w-0 lg:block lg:flex-1">
            <HeroSystemDesktop />
          </div>
        </div>

        {/* ─── Mobile graph (below content) ─────────── */}
        <div className="mt-10 lg:hidden">
          <HeroSystemMobile />
        </div>
      </Container>
    </section>
  );
}
