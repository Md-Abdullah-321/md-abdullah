import { Container } from "@/components/layout/container";
import { H2 } from "@/components/ui/typography";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const todaySteps = [
  ["Website enquiry", "New lead arrives", false],
  ["Form submitted", "Lead information captured", false],
  ["CRM record created", "Record is still unassigned", false],
  ["Someone notices it", "A person has to check and assign", true],
  ["Someone sends follow-up", "The next message depends on memory", true],
  ["Someone books appointment", "The customer waits for the next step", true],
] as const;

const afterBranches = [
  "Lead assigned automatically",
  "Follow-up sent",
  "Calendar link offered",
  "CRM updated",
  "Team notified when judgment is needed",
] as const;

export function Methodology() {
  return (
    <section
      className="relative isolate overflow-hidden bg-background py-16 md:py-20 lg:py-24"
      id="how-i-build"
    >
      <div
        className="pointer-events-none absolute right-0 top-0 -z-10 h-[30rem] w-[30rem] bg-[radial-gradient(circle_at_top_right,rgb(234_246_236_/_0.7),transparent_68%)]"
        aria-hidden="true"
      />
      <div
        className="dot-grid pointer-events-none absolute bottom-20 left-8 -z-10 h-28 w-28 opacity-25 [mask-image:radial-gradient(circle,black,transparent_72%)]"
        aria-hidden="true"
      />

      <Container>
        <RevealGroup className="max-w-4xl">
          <RevealItem variant="label">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-primary">
              How I build systems
            </p>
          </RevealItem>
          <RevealItem variant="heading">
            <H2 className="mt-3 max-w-3xl text-[2rem] leading-[1.08] tracking-[-0.035em] sm:text-[2.8rem] md:text-[3.4rem]">
              I don&apos;t start with the tool.
              <br />
              <span className="text-primary">
                I start with how the business works.
              </span>
            </H2>
          </RevealItem>
          <RevealItem variant="body">
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]">
              First I understand what happens today. Then I find where work gets
              stuck, decide what should run automatically, and connect the
              systems around it.
            </p>
          </RevealItem>
        </RevealGroup>

        <Reveal
          variant="section"
          className="relative mt-12 overflow-hidden rounded-2xl border border-border bg-surface/80 p-5 shadow-xs sm:p-7 lg:mt-14 lg:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(228_232_227_/_0.38)_1px,transparent_1px),linear-gradient(to_bottom,rgb(228_232_227_/_0.38)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
            aria-hidden="true"
          />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] lg:items-stretch lg:gap-8">
            <TodayWorkflow />
            <Transformation />
            <AfterWorkflow />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/70 pt-5 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground/65">
            <span>MESSY</span>
            <span className="text-border">→</span>
            <span className="text-foreground/70">UNDERSTOOD</span>
            <span className="text-border">→</span>
            <span className="text-primary/80">CONNECTED</span>
            <span className="text-border">→</span>
            <span className="text-primary">AUTOMATED</span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function TodayWorkflow() {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 border-b border-border/70 pb-4">
        <p className="font-mono text-xs font-semibold tracking-[0.12em] text-foreground">
          01 · TODAY
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-warning/75">
          manual gaps
        </span>
      </div>
      <div className="relative mt-6 space-y-5 pl-1">
        <div
          className="absolute bottom-2 left-[7px] top-2 w-px bg-border"
          aria-hidden="true"
        />
        {todaySteps.map(([title, description, manual], index) => (
          <div key={title} className="relative grid grid-cols-[14px_1fr] gap-4">
            <span
              className={`relative z-10 mt-1.5 h-3.5 w-3.5 rounded-full border-2 bg-surface ${manual ? "border-warning/65" : "border-border"}`}
              aria-hidden="true"
            />
            <div className={manual ? "opacity-80" : ""}>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] text-muted-foreground/55">
                  0{index + 1}
                </span>
                <p
                  className={`font-heading text-sm font-semibold ${manual ? "text-warning/90" : "text-foreground"}`}
                >
                  {title}
                </p>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
              {manual && (
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-warning/60">
                  needs a person
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Transformation() {
  return (
    <div className="relative flex items-center justify-center lg:flex-col">
      <div
        className="h-px w-12 bg-primary/35 lg:h-20 lg:w-px"
        aria-hidden="true"
      />
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-accent font-mono text-[11px] text-primary">
        →
      </div>
      <div
        className="h-px w-12 bg-primary/35 lg:h-20 lg:w-px"
        aria-hidden="true"
      />
      <span className="absolute -top-5 font-mono text-[9px] uppercase tracking-[0.12em] text-primary/70 lg:static lg:mt-3 lg:[writing-mode:vertical-rl]">
        connect the gaps
      </span>
    </div>
  );
}

function AfterWorkflow() {
  return (
    <div className="rounded-lg border border-primary/15 bg-primary/[0.025] p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4 border-b border-primary/15 pb-4">
        <p className="font-mono text-xs font-semibold tracking-[0.12em] text-foreground">
          02 · AFTER
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
          connected system
        </span>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_4px_rgb(46_158_69_/_0.10)]"
            aria-hidden="true"
          />
          <div>
            <p className="font-heading text-sm font-semibold text-foreground">
              Website enquiry
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Lead arrives in one place
            </p>
          </div>
        </div>

        <div className="ml-1 mt-5 border-l border-primary/35 pl-5">
          <div className="relative rounded-md border border-primary/25 bg-surface px-4 py-3">
            <span
              className="absolute -left-[22px] top-4 h-2.5 w-2.5 rounded-full border-2 border-primary bg-surface"
              aria-hidden="true"
            />
            <p className="font-heading text-sm font-semibold text-primary">
              CRM
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Record created and routed
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {afterBranches.map((branch) => (
              <div key={branch} className="relative flex items-center gap-3">
                <span
                  className="absolute -left-[22px] h-px w-4 bg-primary/35"
                  aria-hidden="true"
                />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <p className="text-xs leading-relaxed text-foreground/80">
                  {branch}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
