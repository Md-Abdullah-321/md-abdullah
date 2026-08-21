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
      "People copy data between platforms, send routine messages manually, and update records by hand — every single day.",
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
      "Things work because someone knows the steps by heart — not because the system handles them reliably.",
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
          <p className="text-sm font-medium tracking-wide text-muted-foreground">
            Common patterns
          </p>
          <H2 className="mt-2">These problems usually aren&apos;t about the tools</H2>
          <Body className="mt-4 text-muted-foreground">
            Most businesses don&apos;t need another platform. They need their
            existing systems, processes, and people to work together properly.
          </Body>
        </div>

        {/* Problem list — numbered editorial layout */}
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className="group relative pl-12"
            >
              {/* Number */}
              <span
                className="absolute left-0 top-0 text-2xl font-bold tabular-nums text-border"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="text-base font-semibold leading-tight text-foreground">
                {problem.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
