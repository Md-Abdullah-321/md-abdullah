import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ear, Route, Compass, Hammer, Cable, RefreshCw } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H1, H2, Body, BodyLarge } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/supabase/settings";
import { getFeaturedProjects } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "About",
  description:
    "Md Abdullah is an Automation & Integration Engineer who helps businesses connect their systems, automate processes, and build reliable workflows.",
};

export default async function AboutPage() {
  const [settings, projects] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
  ]);

  return (
    <>
      {/* ─── Introduction ───────────────────────────── */}
      <Section className="pt-20 md:pt-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-16">
            <div>
              <p className="text-sm font-medium tracking-wide text-muted-foreground">
                About
              </p>
              <H1 className="mt-2">{settings.name}</H1>
              <p className="mt-2 text-lg font-medium text-muted-foreground">
                {settings.title}
              </p>

              <div className="mt-8 space-y-4">
                <BodyLarge>
                  I help businesses connect their systems, automate repetitive
                  processes, and build workflows that run reliably without
                  constant manual intervention.
                </BodyLarge>
                <Body className="text-muted-foreground">
                  Most of the businesses I work with don&apos;t need another
                  tool — they need their existing tools to actually work
                  together. The website doesn&apos;t talk to the CRM, the CRM
                  doesn&apos;t trigger the right follow-ups, and important
                  processes depend on someone remembering to do them.
                </Body>
                <Body className="text-muted-foreground">
                  I fix that. I design the system architecture, connect the
                  platforms, build the automations, and make sure data flows
                  from one step to the next without manual handoffs.
                </Body>
              </div>
            </div>

            {/* Profile image area */}
            <div className="flex items-start justify-center lg:justify-end">
              {settings.profile_image_url ? (
                <div className="aspect-square w-full max-w-[280px] overflow-hidden rounded-xl border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings.profile_image_url}
                    alt={settings.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full max-w-[280px] rounded-xl border border-dashed border-border bg-surface-muted" />
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* ─── How I Think ────────────────────────────── */}
      <Section compact className="bg-surface-muted">
        <Container>
          <div className="max-w-2xl">
            <H2>How I approach business systems</H2>
            <Body className="mt-4 text-muted-foreground">
              I don&apos;t start with technology. I start with the business
              process — what&apos;s happening now, where things break, and what
              the workflow should actually look like. Technology is the
              implementation layer, not the starting point.
            </Body>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Ear className="h-4 w-4" />,
                title: "Understand the problem",
                description:
                  "Before building anything, I need to understand what the business is trying to accomplish and what's currently getting in the way.",
              },
              {
                icon: <Route className="h-4 w-4" />,
                title: "Map the process",
                description:
                  "Trace how information and people move through the system. Identify where things break, where manual work happens, and where data gets lost.",
              },
              {
                icon: <Compass className="h-4 w-4" />,
                title: "Design the system",
                description:
                  "Decide what should be automated, what stays human, and how the tools should interact. Architecture the connections.",
              },
              {
                icon: <Hammer className="h-4 w-4" />,
                title: "Build and connect",
                description:
                  "Implement the CRM workflows, integrations, backend logic, AI components, or custom software required.",
              },
              {
                icon: <Cable className="h-4 w-4" />,
                title: "Wire systems together",
                description:
                  "Connect platforms through APIs and integrations so data flows automatically between them.",
              },
              {
                icon: <RefreshCw className="h-4 w-4" />,
                title: "Test and improve",
                description:
                  "Run the complete workflow end-to-end, identify friction, and refine until it operates smoothly.",
              },
            ].map((step) => (
              <div key={step.title} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/5 text-primary">
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ─── What I Work With ───────────────────────── */}
      <Section compact>
        <Container narrow>
          <H2>What I typically work with</H2>
          <Body className="mt-4 text-muted-foreground">
            The specific tools depend on the business problem. Here are the
            areas I work across — the common thread is connecting systems and
            automating processes.
          </Body>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { area: "CRM Systems", detail: "GoHighLevel, HubSpot, custom builds" },
              { area: "Automation", detail: "n8n, Make, Zapier, custom workflows" },
              { area: "APIs & Integrations", detail: "REST, webhooks, custom connectors" },
              { area: "AI Automation", detail: "OpenAI, classification, routing, RAG" },
              { area: "Backend Development", detail: "Node.js, Supabase, custom APIs" },
              { area: "Web Applications", detail: "Next.js, React, dashboards, portals" },
            ].map((item) => (
              <div
                key={item.area}
                className="rounded-lg border border-border bg-card p-4"
              >
                <p className="text-sm font-semibold">{item.area}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Technology is the implementation layer. The value is in understanding
            the business process and designing the right system — not in knowing
            how many tools exist.
          </p>
        </Container>
      </Section>

      {/* ─── Selected Work ──────────────────────────── */}
      {projects.length > 0 && (
        <Section compact className="bg-surface-muted">
          <Container>
            <div className="flex items-end justify-between">
              <H2>Selected work</H2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/work">
                  All work
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/work/${project.slug}`}
                  className="group rounded-lg border border-border bg-card p-5 transition-colors hover:bg-accent/50"
                >
                  <p className="text-xs text-muted-foreground">
                    {project.category || "Project"}
                  </p>
                  <p className="mt-1 text-sm font-semibold group-hover:text-primary">
                    {project.title}
                  </p>
                  {project.short_description && (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {project.short_description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ─── CTA ────────────────────────────────────── */}
      <Section compact>
        <Container narrow>
          <div className="flex flex-col items-center gap-6 text-center">
            <H2>Have a process that isn&apos;t working?</H2>
            <Body className="max-w-md text-muted-foreground">
              Tell me what&apos;s happening. I&apos;ll explain how I&apos;d
              approach it — no commitment required.
            </Body>
            <Button size="lg" asChild>
              <Link href="/contact">
                Start a Conversation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
