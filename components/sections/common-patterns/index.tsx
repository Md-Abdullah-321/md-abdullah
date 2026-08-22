import { Container } from "@/components/layout/container";
import { H2 } from "@/components/ui/typography";
import { ProcessDesktop } from "./process-desktop";
import { ProcessMobile } from "./process-mobile";

export function CommonPatterns() {
  return (
    <section className="bg-surface-muted py-14 md:py-18 lg:py-20">
      <Container>
        {/* Header */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Common Patterns
          </p>
          <H2 className="mt-2">The problem usually isn&apos;t the tool</H2>
          <p className="mt-3 max-w-[680px] text-base leading-relaxed text-muted-foreground">
            Most businesses already have the tools they need. The problem is what
            happens between them. Someone has to notice, pass it along, and remember
            the next step.
          </p>
        </div>

        {/* Scenario */}
        <p className="mt-8 font-heading text-sm font-semibold text-foreground/80">
          A lead comes in. What happens next?
        </p>

        {/* Process visualization */}
        <div className="mt-5 hidden md:block">
          <ProcessDesktop />
        </div>
        <div className="mt-5 md:hidden">
          <ProcessMobile />
        </div>

        {/* Conclusion */}
        <div className="mt-14 border-t border-border pt-10">
          <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
            <div>
              <p className="font-heading text-xl font-semibold leading-snug md:text-2xl">
                The tools aren&apos;t the problem.
                <br />
                <span className="text-primary">The gaps between them are.</span>
              </p>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                Your team shouldn&apos;t have to remember every handoff. The system
                should move the routine information. People step in when a real
                decision is needed.
              </p>
              <p className="mt-3 text-xs text-muted-foreground/50">
                That&apos;s where I start. With the process, not the tool.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
