import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <Section>
      <Container narrow>
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Visual accent — subtle system-connection metaphor */}
          <div
            className="flex items-center gap-2 text-muted-foreground/40"
            aria-hidden="true"
          >
            <div className="h-px w-8 bg-border" />
            <MessageSquare className="h-5 w-5" />
            <div className="h-px w-8 bg-border" />
          </div>

          {/* Eyebrow */}
          <p className="text-sm font-medium tracking-wide text-muted-foreground">
            Next step
          </p>

          {/* Headline */}
          <H2 className="max-w-md">
            Bring me the problem. We&apos;ll figure out the system.
          </H2>

          {/* Supporting text */}
          <Body className="max-w-lg text-muted-foreground">
            You don&apos;t need to know the technical solution before reaching
            out. Tell me what&apos;s not working — a manual process, a
            disconnected system, a workflow that depends on one person — and
            I&apos;ll explain how I&apos;d approach it.
          </Body>

          {/* CTAs */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/contact">
                Start a Conversation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/work">Explore Case Studies</Link>
            </Button>
          </div>

          {/* Reassurance */}
          <p className="text-xs text-muted-foreground">
            No commitment required. No pressure. Just a conversation about your
            process.
          </p>
        </div>
      </Container>
    </Section>
  );
}
