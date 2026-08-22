import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H1, Body } from "@/components/ui/typography";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell me about your automation, integration, or workflow problem. No technical knowledge required. Just explain what is happening.",
};

export default function ContactPage() {
  return (
    <Section className="pt-20 md:pt-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Intro */}
          <div className="max-w-md">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              Let&apos;s talk
            </p>
            <H1 className="mt-2">Tell me what&apos;s not working</H1>
            <Body className="mt-4 text-muted-foreground">
              You don&apos;t need to know the technical solution. Describe the
              process, what is frustrating, or what you want to change. I&apos;ll
              explain how I&apos;d approach it.
            </Body>

            <div className="mt-8 space-y-4 border-t border-border pt-8">
              <div>
                <p className="text-sm font-medium">What happens next?</p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-medium text-foreground">1.</span>
                    I&apos;ll review your message and understand the situation.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-foreground">2.</span>
                    I&apos;ll reply with initial thoughts on how to approach it.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-foreground">3.</span>
                    We&apos;ll have a conversation about whether it makes sense
                    to work together.
                  </li>
                </ul>
              </div>

              <p className="text-xs text-muted-foreground">
                No commitment. No sales pressure. Just a genuine conversation
                about your process.
              </p>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
