import Link from "next/link";
import { ArrowRight, Users, Zap, Cable, Bot, Code, Wrench, Globe, Database, Settings } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { getPublishedServices } from "@/lib/supabase/queries";

/* ─── Icon mapping ────────────────────────────────────── */

const iconMap: Record<string, React.ReactNode> = {
  users: <Users className="h-5 w-5" />,
  zap: <Zap className="h-5 w-5" />,
  cable: <Cable className="h-5 w-5" />,
  bot: <Bot className="h-5 w-5" />,
  code: <Code className="h-5 w-5" />,
  wrench: <Wrench className="h-5 w-5" />,
  globe: <Globe className="h-5 w-5" />,
  database: <Database className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
};

/* ─── Section ─────────────────────────────────────────── */

export async function ServicesOverview() {
  const services = await getPublishedServices();

  if (services.length === 0) {
    return null; // Don't render section if no published services
  }

  return (
    <Section>
      <Container>
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              Services
            </p>
            <H2 className="mt-2">What I help businesses build</H2>
            <Body className="mt-2 text-muted-foreground">
              Most projects combine a few of these. They work together, not as
              separate one-off fixes.
            </Body>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/services">
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Service grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="relative flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/5 text-primary">
                  {iconMap[service.icon_name] ?? <Zap className="h-5 w-5" />}
                </div>
                <span
                  className="text-2xl font-bold tabular-nums text-border"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="text-base font-semibold text-foreground">
                {service.title}
              </h3>

              {service.problem && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.problem}
                </p>
              )}

              {service.solution && (
                <p className="text-sm leading-relaxed text-foreground/80">
                  {service.solution}
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          A typical project touches two or three of these areas. The goal is
          one workflow that works, not five separate fixes.
        </p>
      </Container>
    </Section>
  );
}
