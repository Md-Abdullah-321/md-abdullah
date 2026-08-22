import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H2, Body } from "@/components/ui/typography";

interface ProblemItem {
  title: string;
  description: string;
}

const problems: ProblemItem[] = [
  {
    title: "Leads are falling through the cracks",
    description:
      "New leads arrive, but follow-up depends on someone remembering to do it. When they don't, opportunities disappear quietly.",
  },
  {
    title: "Too much time spent on repetitive work",
    description:
      "People copy data between platforms, send routine messages manually, and update records by hand. Every single day.",
  },
  {
    title: "Your systems don't talk to each other",
    description:
      "Website, CRM, calendar, payment, and communication tools all run separately. Nothing flows automatically.",
  },
  {
    title: "The CRM doesn't reflect how you actually work",
    description:
      "The pipeline, statuses, and fields were set up once and never adapted. Nobody trusts the data, so nobody uses it properly.",
  },
  {
    title: "Important processes depend on one person",
    description:
      "Things work because someone knows the steps by heart. Not because the system handles them on its own.",
  },
  {
    title: "Customers wait for things that could be instant",
    description:
      "Confirmations, reminders, status updates, and follow-ups still require someone to press send.",
  },
];

export function ProblemRecognition() {
  return (
    <Section>
      <Container>
        {/* Section header */}
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Common patterns
          </p>
          <H2 className="mt-3">These problems usually aren&apos;t about the tools</H2>
          <Body className="mt-4 text-muted-foreground">
            Most businesses don&apos;t need another platform. They need their
            existing tools, processes, and people to work together properly.
          </Body>
        </div>

        {/* Problem grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className="group relative rounded-xl border border-border/70 bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
            >
              {/* Number */}
              <span
                className="absolute top-5 right-5 text-3xl font-bold text-border/80 transition-colors group-hover:text-primary/20"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="pr-12 text-base font-semibold leading-tight text-foreground">
                {problem.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
