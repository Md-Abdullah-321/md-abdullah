import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Display, BodyLarge } from "@/components/ui/typography";
import { HeroVisual } from "./hero-visual";

export function Hero() {
  return (
    <Section className="pt-20 md:pt-28 lg:pt-32">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          {/* ─── Content ────────────────────────────── */}
          <div className="flex flex-1 flex-col gap-6">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              Automation &amp; Integration Engineer
            </p>

            <Display as="h1">
              I connect your systems so your business runs without you holding
              it together
            </Display>

            <BodyLarge className="max-w-xl text-muted-foreground">
              Disconnected tools, manual follow-ups, and brittle processes slow
              your team down. I design and build the automations, integrations,
              and workflows that make your CRM, APIs, and internal systems work
              as one.
            </BodyLarge>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
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

            {/* Proof indicator — subtle, swappable */}
            <p className="pt-2 text-sm text-muted-foreground">
              Helping businesses streamline operations through automation and
              custom systems.
            </p>
          </div>

          {/* ─── Visual ─────────────────────────────── */}
          <div className="w-full shrink-0 lg:w-[380px] xl:w-[420px]">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </Section>
  );
}
