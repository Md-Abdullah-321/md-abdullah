import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users, Zap, Cable, Bot, Code, Wrench, Globe, Database, Settings } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H1, H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { getPublishedServices } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Automation, integration, CRM, AI, and custom software services for businesses with operational problems.",
};

const iconMap: Record<string, React.ReactNode> = {
  users: <Users className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  cable: <Cable className="h-6 w-6" />,
  bot: <Bot className="h-6 w-6" />,
  code: <Code className="h-6 w-6" />,
  wrench: <Wrench className="h-6 w-6" />,
  globe: <Globe className="h-6 w-6" />,
  database: <Database className="h-6 w-6" />,
  settings: <Settings className="h-6 w-6" />,
};

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <Section className="pt-20 md:pt-28">
      <Container className="max-w-[1240px]">
        <div className="max-w-xl">
          <H1>Services</H1>
          <Body className="mt-4 text-muted-foreground">
            Each project starts with a business problem, not a technology
            decision. Here&apos;s what I help businesses build.
          </Body>
        </div>

        <div className="mt-12 space-y-6">
          {services.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Services are being documented and will appear here soon.
              </p>
            </div>
          ) : (
            services.map((service) => (
              <article
                key={service.id}
                className="rounded-lg border border-border bg-card p-6 sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                    {iconMap[service.icon_name] ?? <Zap className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{service.title}</h2>
                    {service.short_description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {service.short_description}
                      </p>
                    )}
                  </div>
                </div>

                {(service.problem || service.solution) && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {service.problem && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          When you need this
                        </p>
                        <p className="mt-2 text-sm leading-relaxed">
                          {service.problem}
                        </p>
                      </div>
                    )}
                    {service.solution && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          What I build
                        </p>
                        <p className="mt-2 text-sm leading-relaxed">
                          {service.solution}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-lg border border-border bg-card p-8 text-center">
          <H2 className="text-xl">Not sure which service fits?</H2>
          <p className="mt-2 text-sm text-muted-foreground">
            Describe the problem. I&apos;ll figure out the right approach.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/contact">
              Start a Conversation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
