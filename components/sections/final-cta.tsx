import { ArrowRight, MessageSquare } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TrackLink } from "@/components/analytics/track-link";

/* ─── FinalCTA ─────────────────────────────────────────
 * One CTA design for the whole site. The homepage uses
 * the defaults; the project page passes its own copy.
 */

interface FinalCTAProps {
  label?: string;
  heading?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  reassurance?: string;
}

export function FinalCTA({
  label = "Next step",
  heading = "Have a process that's slowing your team down?",
  body = "You don't need to know the technical solution before reaching out. Tell me what's not working. A manual process, a tool that doesn't talk to the others, or a workflow that depends on one person. I'll explain how I'd approach it.",
  primaryLabel = "Start a Conversation",
  primaryHref = "/contact",
  secondaryLabel = "Explore Case Studies",
  secondaryHref = "/work",
  reassurance = "No commitment. No pressure. Just a conversation about your process.",
}: FinalCTAProps) {
  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-xl border border-primary/25 bg-surface-muted px-6 py-16 sm:px-12 md:py-20">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-primary/15 bg-accent/60" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-48 w-48 rounded-full border border-primary/10 bg-primary/[0.04]" aria-hidden="true" />

          <RevealGroup className="relative mx-auto flex max-w-lg flex-col items-center gap-6 text-center" stagger={0.07}>
            <RevealItem variant="body">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/25 bg-accent">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </RevealItem>

            <RevealItem variant="label">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                {label}
              </p>
            </RevealItem>

            <RevealItem variant="heading">
              <H2>{heading}</H2>
            </RevealItem>

            <RevealItem variant="body">
              <Body className="max-w-md text-muted-foreground">
                {body}
              </Body>
            </RevealItem>

            <RevealItem variant="body">
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button size="lg" asChild>
                  <TrackLink
                    href={primaryHref}
                    event={{ event: "cta_click", cta_name: "start_a_conversation", location: "next_step" }}
                  >
                    {primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </TrackLink>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <TrackLink
                    href={secondaryHref}
                    event={{ event: "cta_click", cta_name: "see_my_work", location: "next_step" }}
                  >
                    {secondaryLabel}
                  </TrackLink>
                </Button>
              </div>
            </RevealItem>

            <RevealItem variant="body">
              <p className="text-xs text-muted-foreground">
                {reassurance}
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
