import { Container } from "@/components/layout/container";
import { H2 } from "@/components/ui/typography";

const capabilities = [
  {
    number: "01",
    title: "Capture",
    headline: "Every entry point feeds one place",
    description: "Your website, forms, chatbots, voice AI, and email all connect to your CRM. No one has to copy the data in by hand.",
  },
  {
    number: "02",
    title: "Process",
    headline: "Routine work runs on its own",
    description: "Follow-ups go out. Leads get assigned. Tasks get created. Messages get sent. Without someone pressing a button each time.",
  },
  {
    number: "03",
    title: "Connect",
    headline: "Your tools share what they need to",
    description: "CRM, calendar, payments, messaging, and internal tools talk to each other through APIs and automation.",
  },
  {
    number: "04",
    title: "Decide",
    headline: "AI handles the simple decisions",
    description: "Lead qualification, routing, responses, and knowledge lookup. I use AI where it actually helps, not where it just adds complexity.",
  },
  {
    number: "05",
    title: "Involve",
    headline: "Your team gets the right work",
    description: "People step in for judgment calls, complex conversations, and decisions. The system handles everything else.",
  },
];

export function SystemVisualization() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <Container className="max-w-[1240px]">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              What Gets Built
            </p>
            <H2 className="mt-2">
              What gets built when the pieces work together
            </H2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
            I connect CRMs, automation, APIs, AI, and internal tools into
            one workflow your team can actually rely on.
          </p>
        </div>

        {/* Capabilities */}
        <div className="mt-14 divide-y divide-border">
          {capabilities.map((cap) => (
            <div
              key={cap.number}
              className="grid gap-4 py-8 first:pt-0 last:pb-0 md:grid-cols-[60px_140px_1fr] md:gap-8 md:py-10"
            >
              {/* Number */}
              <span className="font-heading text-3xl font-semibold text-border/80 md:text-4xl">
                {cap.number}
              </span>

              {/* Title */}
              <span className="font-heading text-base font-semibold text-foreground md:pt-2">
                {cap.title}
              </span>

              {/* Content */}
              <div className="md:pt-1">
                <p className="font-heading text-lg font-semibold leading-snug text-foreground md:text-xl">
                  {cap.headline}
                </p>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {cap.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech context */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground/50">
            Built with GoHighLevel, n8n, Make, OpenAI, Stripe, and custom APIs. The tool comes later. First I need to understand the problem.
          </p>
        </div>
      </Container>
    </section>
  );
}
