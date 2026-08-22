import {
  Ear,
  Route,
  Compass,
  Hammer,
  Cable,
  RefreshCw,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H2, Body } from "@/components/ui/typography";

interface ApproachStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: ApproachStep[] = [
  {
    number: "01",
    title: "Understand",
    description:
      "Learn what the business is trying to accomplish and what's currently getting in the way.",
    icon: <Ear className="h-4 w-4" />,
  },
  {
    number: "02",
    title: "Map",
    description:
      "Trace how information and people move through the existing process. Identify where things break.",
    icon: <Route className="h-4 w-4" />,
  },
  {
    number: "03",
    title: "Design",
    description:
      "Decide what should be automated, what stays human, and how systems should interact.",
    icon: <Compass className="h-4 w-4" />,
  },
  {
    number: "04",
    title: "Build",
    description:
      "Implement the CRM workflows, integrations, backend logic, or custom software required.",
    icon: <Hammer className="h-4 w-4" />,
  },
  {
    number: "05",
    title: "Connect",
    description:
      "Wire systems together through APIs and integrations so data flows reliably between them.",
    icon: <Cable className="h-4 w-4" />,
  },
  {
    number: "06",
    title: "Improve",
    description:
      "Test the full workflow, find what is still awkward, and keep refining until it runs smoothly.",
    icon: <RefreshCw className="h-4 w-4" />,
  },
];

export function Approach() {
  return (
    <Section className="bg-surface-muted">
      <Container>
        {/* Header — left-aligned to match Problem Recognition */}
        <div className="max-w-xl">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">
            Methodology
          </p>
          <H2 className="mt-2">I start with the process, not the tool</H2>
          <Body className="mt-4 text-muted-foreground">
            I don&apos;t start by asking which tool we should use. First I want
            to understand how the business works today. Then I look at where
            things get stuck and build from there.
          </Body>
        </div>

        {/* Timeline */}
        <div className="relative mt-14">
          {/* Vertical connector line — visible on md+ */}
          <div
            className="absolute left-[19px] top-2 hidden h-[calc(100%-1rem)] w-px bg-border md:block"
            aria-hidden="true"
          />

          <ol className="space-y-8 md:space-y-10">
            {steps.map((step) => (
              <li key={step.number} className="relative flex gap-5 md:gap-6">
                {/* Node indicator */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-xs">
                  <span className="text-primary" aria-hidden="true">
                    {step.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-medium tabular-nums text-muted-foreground">
                      {step.number}
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
