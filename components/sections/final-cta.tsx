import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-xl border border-primary/25 bg-surface-muted px-6 py-16 sm:px-12 md:py-20">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-primary/15 bg-accent/60" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-48 w-48 rounded-full border border-primary/10 bg-primary/[0.04]" aria-hidden="true" />

          <div className="relative mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/25 bg-accent">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>

            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              Next step
            </p>

            <H2>Have a process that&apos;s slowing your team down?</H2>

            <Body className="max-w-md text-muted-foreground">
              You don&apos;t need to know the technical solution before reaching
              out. Tell me what&apos;s not working. A manual process, a tool that
              doesn&apos;t talk to the others, or a workflow that depends on one
              person. I&apos;ll explain how I&apos;d approach it.
            </Body>

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

            <p className="text-xs text-muted-foreground">
              No commitment. No pressure. Just a conversation about your process.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
