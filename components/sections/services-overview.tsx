import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Body } from "@/components/ui/typography";
import { getPublishedServices } from "@/lib/supabase/queries";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const tools = [
  "GoHighLevel",
  "n8n",
  "OpenAI",
  "APIs",
  "Make",
  "Zapier",
  "Node.js",
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-primary">
      {children}
    </p>
  );
}

function ServiceText({
  number,
  title,
  copy,
  tools: serviceTools,
}: {
  number: string;
  title: string;
  copy: string;
  tools: string;
}) {
  return (
    <div className="max-w-xl">
      <Label>{number}</Label>
      <h3 className="mt-5 font-mono text-4xl font-semibold uppercase leading-[1.02] tracking-[-0.065em] text-foreground sm:text-6xl">
        {title}
      </h3>
      <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
        {copy}
      </p>
      <p className="mt-8 font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
        {serviceTools}
      </p>
    </div>
  );
}

function CrmArtifact() {
  return (
    <div className="relative min-h-[330px] border-y border-border/80 py-8 sm:min-h-[390px] sm:py-10">
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
        <span>REAL PROJECT WORK</span>
        <span>CRM / 01</span>
      </div>
      <div className="flex h-[245px] items-center justify-center sm:h-[300px]">
        <p className="font-mono text-[clamp(4rem,11vw,8rem)] font-semibold leading-none tracking-[-0.12em] text-foreground/90">
          CRM<span className="text-primary">.</span>
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-border/80 pt-4 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
        <span>LEADS / FOLLOW-UP / APPOINTMENTS</span>
        <span className="text-primary">01</span>
      </div>
    </div>
  );
}

function AutomationStatement() {
  return (
    <div className="flex min-h-[310px] flex-col justify-center border-y border-border/80 py-10 sm:min-h-[390px]">
      <p className="font-mono text-4xl font-semibold leading-[0.95] tracking-[-0.08em] text-foreground sm:text-7xl">
        LESS
        <br />
        COPYING.
      </p>
      <p className="mt-2 font-mono text-4xl font-semibold leading-[0.95] tracking-[-0.08em] text-primary sm:text-7xl">
        MORE WORK
        <br />
        MOVING.
      </p>
      <p className="mt-8 max-w-xs text-xs leading-5 text-muted-foreground">
        A better process removes the steps people have to remember.
      </p>
    </div>
  );
}

function ConnectTreatment() {
  return (
    <div className="relative flex min-h-[310px] items-center justify-center overflow-hidden border-y border-border/80 py-10 sm:min-h-[390px]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-full border-l border-border/70" />
      <div className="pointer-events-none absolute left-0 top-1/2 w-full border-t border-border/70" />
      <p className="relative bg-background px-5 font-mono text-[clamp(3.2rem,10vw,8rem)] font-semibold leading-none tracking-[-0.12em] text-foreground">
        CONNECT<span className="text-primary">.</span>
      </p>
    </div>
  );
}

function AiStatement() {
  return (
    <div className="flex min-h-[330px] flex-col justify-center px-1 py-10 sm:min-h-[410px] sm:px-8">
      <p className="font-mono text-4xl font-semibold leading-[0.95] tracking-[-0.08em] text-foreground sm:text-7xl">
        AI SHOULD
        <br />
        <span className="text-primary">DO MORE</span>
        <br />
        THAN CHAT.
      </p>
    </div>
  );
}

export async function ServicesOverview() {
  const services = await getPublishedServices();
  if (services.length === 0) return null;

  return (
    <Section
      className="relative isolate overflow-hidden bg-background"
      id="systems"
    >
      <div className="pointer-events-none absolute -left-72 top-0 -z-10 h-[42rem] w-[42rem] rounded-full bg-accent/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-72 top-[42rem] -z-10 h-[38rem] w-[38rem] rounded-full border border-primary/[0.07] bg-primary/[0.025]" />
      <div className="pointer-events-none absolute bottom-24 left-1/2 -z-10 h-px w-[60vw] -translate-x-1/2 bg-primary/[0.08]" />
      <Container>
        <header className="max-w-4xl pb-24 md:pb-40">
          <Label>SERVICES</Label>
          <h2 className="mt-6 max-w-4xl font-mono text-4xl font-semibold leading-[1.01] tracking-[-0.07em] text-foreground sm:text-6xl lg:text-8xl">
            What I build when
            <br />
            <span className="text-primary">the work gets stuck.</span>
          </h2>
          <Body className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            CRM, automation, integrations and AI workflows that help your team
            spend less time moving information around.
          </Body>
        </header>

        <div className="space-y-32 md:space-y-52">
          <article className="grid items-center gap-14 lg:grid-cols-[0.76fr_1.24fr] lg:gap-24">
            <ServiceText
              number="01"
              title="CRM & sales systems"
              copy="Keep leads moving from first contact to follow-up, appointment and sale."
              tools="GoHighLevel · CRM · Pipelines · Follow-up"
            />
            <CrmArtifact />
          </article>

          <article className="grid items-center gap-14 lg:grid-cols-[1.16fr_0.84fr] lg:gap-24">
            <AutomationStatement />
            <ServiceText
              number="02"
              title="Business process automation"
              copy="Remove the repetitive work your team keeps doing manually."
              tools="Workflows · Handoffs · Notifications · Data movement"
            />
          </article>

          <article className="grid items-center gap-14 lg:grid-cols-[0.76fr_1.24fr] lg:gap-24">
            <ServiceText
              number="03"
              title="Integrations & APIs"
              copy="Make your CRM, website, payments and other systems work together."
              tools="REST APIs · Webhooks · Backend logic · Data sync"
            />
            <ConnectTreatment />
          </article>

          <article className="relative grid items-center gap-10 overflow-hidden rounded-[var(--radius-lg)] bg-accent/40 px-6 py-8 sm:px-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-24 lg:px-16 lg:py-12">
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-primary/[0.1] bg-primary/[0.035]" />
            <AiStatement />
            <div className="relative">
              <ServiceText
                number="04"
                title="AI automation"
                copy="Use AI where it can actually save time."
                tools="AI agents · Chatbots · Classification · Routing · RAG · Extraction"
              />
              <p className="mt-8 max-w-sm text-sm leading-6 text-muted-foreground">
                AI should handle a useful part of the process, then leave people
                with the judgment calls.
              </p>
            </div>
          </article>
        </div>

        <div className="mt-32 border-t border-border/80 pt-6 md:mt-52">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-baseline sm:justify-between">
            <Label>TOOLS I USE</Label>
            <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs text-muted-foreground">
              {tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-10">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/services">
              See all services <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
