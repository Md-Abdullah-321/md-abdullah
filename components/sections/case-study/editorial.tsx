import { Container } from "@/components/layout/container";
import { RichText } from "@/components/ui/rich-text";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/* ─── Case Study Editorial System ──────────────────────
 * Built on the homepage's own primitives, not a second
 * design system: green mono labels, the homepage heading
 * scale, border-t sections with alternating background
 * bands, and the split editorial grid used in
 * "Common patterns".
 */

export function CaseLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary",
        className
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <RevealGroup stagger={0.08}>
      <RevealItem variant="label">
        <CaseLabel>{label}</CaseLabel>
      </RevealItem>
      <RevealItem variant="heading">
        <h2 className="mt-3 font-mono text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground text-balance sm:text-[2.25rem] md:text-[2.75rem]">
          {title}
        </h2>
      </RevealItem>
    </RevealGroup>
  );
}

export function CaseSection({
  children,
  className,
  compact = false,
  muted = false,
}: {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  muted?: boolean;
}) {
  return (
    <section
      className={cn(
        "border-t border-border/80",
        muted && "bg-surface-muted",
        className
      )}
    >
      <Container>
        <div className={compact ? "py-10 md:py-12" : "py-16 md:py-20 lg:py-24"}>
          {children}
        </div>
      </Container>
    </section>
  );
}

/**
 * Split story: label on the left, heading + content on the right.
 * For short editorial sections (Context / Problem / Outcome).
 * Mirrors the "Common patterns" grid on the homepage.
 */
export function StorySplit({
  label,
  title,
  content,
  muted = false,
  narrow = false,
  footer,
}: {
  label: string;
  title: string;
  content: string;
  muted?: boolean;
  /** Narrower margin column for the label, giving the content more room. */
  narrow?: boolean;
  /** Full-width element below the grid, spanning both columns. */
  footer?: React.ReactNode;
}) {
  return (
    <CaseSection muted={muted}>
      <div
        className={cn(
          "grid gap-8 md:gap-x-16",
          narrow
            ? "md:grid-cols-[minmax(190px,0.6fr)_minmax(0,1.4fr)]"
            : "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        )}
      >
        <Reveal variant="label">
          <CaseLabel>{label}</CaseLabel>
        </Reveal>
        <div>
          <Reveal variant="heading">
            <h2 className="font-mono text-2xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-3xl md:text-[2.25rem]">
              {title}
            </h2>
          </Reveal>
          <Reveal variant="body" delay={0.08} className="mt-6 border-t border-border/60 pt-6">
            <RichText content={content} className="max-w-2xl" />
          </Reveal>
        </div>
        {footer && (
          <Reveal variant="body" delay={0.16} className="md:col-span-2">
            {footer}
          </Reveal>
        )}
      </div>
    </CaseSection>
  );
}

/**
 * Wide story: label and heading on top, long-form content below.
 * For sections where the writing needs the full measure
 * (Solution) — no permanent empty label column.
 */
export function StoryWide({
  label,
  title,
  content,
  muted = false,
}: {
  label: string;
  title: string;
  content: string;
  muted?: boolean;
}) {
  return (
    <CaseSection muted={muted}>
      <div className="max-w-4xl">
        <SectionHeading label={label} title={title} />
        <Reveal variant="body" className="mt-8 border-t border-border/60 pt-8">
          <RichText content={content} className="max-w-3xl" />
        </Reveal>
      </div>
    </CaseSection>
  );
}
