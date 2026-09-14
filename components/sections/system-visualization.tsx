import { Container } from "@/components/layout/container";
import { H2 } from "@/components/ui/typography";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const systems = [
  { number: "01", title: "CRM & sales systems", pattern: ["Lead", "Qualification", "Follow-up", "Appointment"] },
  { number: "02", title: "AI automation", pattern: ["Conversation", "Decision", "Action", "Human handoff"] },
  { number: "03", title: "Integrations", pattern: ["Website", "API", "CRM", "Automation"] },
  { number: "04", title: "Operations", pattern: ["Request", "Processing", "Team", "Completion"] },
] as const;

export function SystemVisualization() {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24" id="systems">
      <Container>
        <RevealGroup className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <RevealItem>
            <div className="max-w-lg">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">What I build</p>
              <H2 className="mt-3 max-w-xl">Systems that keep work moving.</H2>
            </div>
          </RevealItem>
          <RevealItem variant="body">
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">Common system patterns, shaped around the way your business already works.</p>
          </RevealItem>
        </RevealGroup>

        <Reveal variant="section" className="mt-14 divide-y divide-border">
          {systems.map((system) => (
            <div key={system.number} className="grid gap-5 py-7 first:pt-0 last:pb-0 sm:grid-cols-[3.5rem_minmax(11rem,0.8fr)_minmax(0,1.2fr)] sm:items-start sm:gap-8 sm:py-9">
              <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-primary">{system.number}</span>
              <h3 className="font-mono text-lg font-semibold uppercase leading-snug tracking-[-0.04em] text-foreground sm:text-xl">{system.title}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground sm:pt-1">
                {system.pattern.map((step, index) => (
                  <span key={step} className="inline-flex items-center gap-x-3">
                    {index > 0 && <span className="text-primary/60" aria-hidden="true">→</span>}
                    <span>{step}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal variant="body" className="mt-12 border-t border-border pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/65">The process comes first. The tools support it.</p>
        </Reveal>
      </Container>
    </section>
  );
}
