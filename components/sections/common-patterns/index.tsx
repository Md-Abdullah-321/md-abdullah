import { Container } from "@/components/layout/container";
import { H2 } from "@/components/ui/typography";
import { ProcessDesktop } from "./process-desktop";
import { ProcessMobile } from "./process-mobile";

export function CommonPatterns() {
  return (
    <section className="relative isolate overflow-hidden bg-surface-muted py-16 md:py-20 lg:py-24">
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-96 w-96 bg-[radial-gradient(circle_at_top_right,rgb(234_246_236_/_0.7),transparent_68%)]" aria-hidden="true" />
      <div className="dot-grid pointer-events-none absolute bottom-16 left-8 -z-10 h-24 w-24 opacity-25 [mask-image:radial-gradient(circle,black,transparent_72%)]" aria-hidden="true" />
      <Container>
        <div className="max-w-4xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">Common patterns</p>
          <H2 className="mt-3 max-w-3xl text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem]">The problem usually isn&apos;t the tool.</H2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]">Most businesses already have the tools they need. The problem is what happens between them. Someone has to notice, pass it along, and remember the next step.</p>
        </div>
        <p className="mt-10 font-heading text-sm font-semibold text-foreground/80 sm:mt-12">A lead comes in. What happens next?</p>
        <div className="mt-6 hidden md:block"><ProcessDesktop /></div>
        <div className="mt-6 md:hidden"><ProcessMobile /></div>
        <div className="mt-12 border-t border-border pt-8 md:mt-16 md:pt-10">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <div><p className="max-w-lg font-heading text-2xl font-semibold leading-[1.08] tracking-[-0.03em] md:text-3xl">The tools aren&apos;t the problem.<br /><span className="text-primary">The gaps between them are.</span></p></div>
            <div className="max-w-xl"><p className="text-sm leading-relaxed text-muted-foreground sm:text-base">Your team shouldn&apos;t have to remember every handoff. The system should move the routine information. People step in when a real decision is needed.</p><p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">That&apos;s where I start. With the process, not the tool.</p></div>
          </div>
        </div>
      </Container>
    </section>
  );
}
