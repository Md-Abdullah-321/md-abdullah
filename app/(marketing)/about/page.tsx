import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Display, H2, Body } from "@/components/ui/typography";
import { ProfileImage } from "@/components/media/profile-image";
import { getSiteSettings } from "@/lib/supabase/settings";
import { resolveExternalImageUrl } from "@/lib/media/image-url";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "Md Abdullah is an Automation & Integration Engineer who connects business tools, automates repetitive work, and builds custom workflows.",
};

const timeline = [
  { title: "Development", sub: "Building software from scratch" },
  { title: "Web & Backend", sub: "APIs, databases, server logic" },
  { title: "Integrations", sub: "Connecting tools that don't talk to each other" },
  { title: "Automation", sub: "Removing manual handoffs" },
  { title: "Business Systems", sub: "Designing full workflows" },
];

const capabilities = [
  {
    title: "CRM & Business Systems",
    sub: "Setting up the CRM around how your team actually works.",
    tech: "GoHighLevel · HubSpot",
  },
  {
    title: "Automation",
    sub: "Removing repetitive handoffs, follow-ups, and manual updates.",
    tech: "n8n · Make · Zapier",
  },
  {
    title: "Integrations & APIs",
    sub: "Connecting systems that need to share data but don't have a direct link.",
    tech: "REST · Webhooks · Custom",
  },
  {
    title: "AI Automation",
    sub: "Using AI when it can handle a useful part of the process without making things harder to manage.",
    tech: "OpenAI · Custom",
  },
  {
    title: "Backend & Custom Software",
    sub: "Building the missing pieces when existing platforms aren't enough.",
    tech: "Node.js · Supabase · Next.js",
  },
  {
    title: "Internal Tools",
    sub: "Dashboards, portals, admin systems, and operational software.",
    tech: "React · Custom builds",
  },
];

const automateItems = [
  "Routine follow-ups",
  "Data movement between systems",
  "Notifications and reminders",
  "Record keeping and updates",
  "Lead assignment and routing",
];

const humanItems = [
  "Relationship conversations",
  "Complex judgment calls",
  "Exception handling",
  "Strategic decisions",
  "Creative problem solving",
];

const tools = [
  "GoHighLevel",
  "n8n",
  "Make",
  "Zapier",
  "OpenAI",
  "Stripe",
  "NMI",
  "WordPress",
  "Node.js",
  "Supabase",
  "React",
  "Next.js",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
      {children}
    </p>
  );
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const profileImageUrl = resolveExternalImageUrl(settings.profile_image_url);

  return (
    <>
      {/* Hero */}
      <Section compact className="pt-20 md:pt-24">
        <Container className="max-w-[1240px]">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_340px] lg:gap-14 xl:grid-cols-[1fr_380px]">
            <div className="max-w-2xl">
              <SectionLabel>About</SectionLabel>
              <Display as="h1" className="mt-3">
                I build systems that make businesses easier to run.
              </Display>
              <p className="mt-4 text-base font-medium text-foreground/80">
                {settings.name} · {settings.title}
              </p>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                {settings.bio ? (
                  <p>{settings.bio}</p>
                ) : (
                  <p>
                    I work on automation, integrations, CRM systems, APIs, and
                    custom software.
                  </p>
                )}
                <p>
                  I started with software development and gradually moved closer
                  to the business side of the problem. The more systems I worked
                  with, the more I saw the same issue. Businesses had good tools,
                  but the tools were not connected properly.
                </p>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <ProfileImage
                src={profileImageUrl ?? ""}
                name={settings.name}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* How I think */}
      <Section compact className="bg-surface-muted">
        <Container className="max-w-[1240px]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 lg:items-start">
            <div className="max-w-xl">
              <SectionLabel>How I think</SectionLabel>
              <H2 className="mt-2">
                Automation isn&apos;t about automating everything
              </H2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  The best systems don&apos;t try to remove people from every
                  process. They remove the repetitive work so people can focus on
                  the decisions that actually require them.
                </p>
                <p>
                  I usually start by understanding how the business actually
                  operates. Sometimes the answer is a CRM workflow. Sometimes
                  it&apos;s an API integration. Sometimes it&apos;s custom
                  software. And sometimes the best answer is to leave something
                  alone.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Automate
                </p>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-foreground/80">
                  {automateItems.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Keep human
                </p>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-foreground/80">
                  {humanItems.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-border" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Background */}
      <Section compact>
        <Container className="max-w-[1240px]">
          <div className="max-w-2xl">
            <SectionLabel>Background</SectionLabel>
            <H2 className="mt-2">How I got here</H2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                I started from software development and gradually moved closer to
                the business process itself. The more systems I worked with, the
                more I noticed that the hardest problems usually weren&apos;t
                about writing code. They were about making different systems,
                people, and processes work together.
              </p>
              <p>That is what pushed me toward automation and integrations.</p>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-border/70 bg-card p-6 md:p-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {timeline.map((item, index) => (
                <div key={item.title} className="relative">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        index === timeline.length - 1
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className="hidden h-px flex-1 bg-border lg:block"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p className="mt-4 font-heading text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Capabilities */}
      <Section compact className="bg-surface-muted">
        <Container className="max-w-[1240px]">
          <div className="max-w-2xl">
            <SectionLabel>Capabilities</SectionLabel>
            <H2 className="mt-2">What I actually work on</H2>
            <Body className="mt-4 text-muted-foreground">
              Most projects combine a few of these areas. The work usually
              connects CRM, automation, integrations, and custom software.
            </Body>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-border/70 bg-card p-6 transition-colors hover:border-primary/20"
              >
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.sub}
                </p>
                <p className="mt-4 text-[11px] text-primary/50">{item.tech}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Tools */}
      <Section compact className="pb-8 md:pb-12">
        <Container className="max-w-[1240px]">
          <div className="rounded-xl border border-border/70 bg-card p-6 md:p-8">
            <div className="max-w-2xl">
              <H2 as="h2">I don&apos;t start with the tool</H2>
              <div className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground">
                <p>
                  GoHighLevel might be the right answer for one business. n8n
                  might be better for another. A custom API may make more sense
                  somewhere else.
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Tools change. The business process comes first.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
