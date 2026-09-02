import { renderInline, RichText } from "@/components/ui/rich-text";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { CaseSection, SectionHeading } from "./editorial";

/* ─── The Shift ────────────────────────────────────────
 * Editorial before/after using the homepage's process
 * language. Two related states, distinguished by layout
 * and typography alone: BEFORE stays flat and muted,
 * AFTER carries the green rail, indexes and markers —
 * so the shift reads without any diagram or box.
 */

type ShiftData = { steps: string[]; prose: string[] };

function parseShift(content: string): ShiftData {
  const steps: string[] = [];
  const prose: string[] = [];

  for (const raw of content.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.includes("→")) {
      // Flow line: one step per segment around the arrows.
      line
        .split("→")
        .map((segment) => segment.trim())
        .filter(Boolean)
        .forEach((step) => steps.push(step));
    } else {
      prose.push(line);
    }
  }

  return { steps, prose };
}

function ShiftStep({
  number,
  label,
  tone,
}: {
  number: string;
  label: string;
  tone: "before" | "after";
}) {
  return (
    <div className="grid grid-cols-[28px_1fr] gap-3 py-3.5 first:pt-0 last:pb-0">
      <span
        className={cn(
          "font-mono text-[10px]",
          tone === "after"
            ? "font-semibold text-primary/70"
            : "text-muted-foreground/45"
        )}
      >
        {number}
      </span>
      <div className="relative">
        {tone === "after" && (
          <span
            className="absolute -left-[18px] top-1.5 h-1.5 w-1.5 rounded-full bg-primary"
            aria-hidden="true"
          />
        )}
        <p
          className={cn(
            "font-heading text-sm",
            tone === "after"
              ? "font-semibold text-foreground"
              : "font-medium text-foreground/75"
          )}
        >
          {renderInline(label, `shift-${tone}-${number}`)}
        </p>
      </div>
    </div>
  );
}

function ShiftProse({ content }: { content: string }) {
  return (
    <div className="mt-5 border-t border-border/50 pt-4">
      <RichText
        content={content}
        className="text-xs leading-relaxed text-muted-foreground/75 sm:text-sm"
      />
    </div>
  );
}

export function TheShift({
  before,
  after,
}: {
  before: string | null;
  after: string | null;
}) {
  if (!before && !after) return null;

  const beforeData = before ? parseShift(before) : null;
  const afterData = after ? parseShift(after) : null;

  return (
    <CaseSection>
      <SectionHeading label="THE SHIFT" title="From friction to flow." />

      {/* ─── Desktop: two related states, typography does the talking ─── */}
      <div className="mt-10 hidden md:block">
        <div
          className={cn(
            "grid gap-10",
            beforeData &&
              afterData &&
              "md:grid-cols-[0.82fr_1fr] md:gap-14 lg:gap-20"
          )}
        >
          {beforeData && (
            <Reveal variant="body" delay={0.08} className="border-l border-border/80 pl-5 md:pl-7">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/65">
                Before / the friction
              </p>
              <div className="mt-6 divide-y divide-border/50">
                {beforeData.steps.map((step, index) => (
                  <ShiftStep
                    key={step}
                    number={String(index + 1).padStart(2, "0")}
                    label={step}
                    tone="before"
                  />
                ))}
              </div>
              {beforeData.prose.length > 0 && (
                <ShiftProse content={beforeData.prose.join("\n")} />
              )}
            </Reveal>
          )}

          {afterData && (
            <Reveal variant="body" delay={0.16} className="border-l border-primary/45 pl-5 md:pl-7">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                After / the system
              </p>
              <div className="mt-6 divide-y divide-border/50">
                {afterData.steps.map((step, index) => (
                  <ShiftStep
                    key={step}
                    number={String(index + 1).padStart(2, "0")}
                    label={step}
                    tone="after"
                  />
                ))}
              </div>
              {afterData.prose.length > 0 && (
                <ShiftProse content={afterData.prose.join("\n")} />
              )}
            </Reveal>
          )}
        </div>
      </div>

      {/* ─── Mobile: stacked rails, before then after ─── */}
      <div className="mt-10 space-y-9 md:hidden">
        {beforeData && (
          <Reveal variant="body" delay={0.08} className="border-l border-border/80 pl-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/65">
              Before / the friction
            </p>
            <div className="mt-5 space-y-5">
              {beforeData.steps.map((step, index) => (
                <div key={step} className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-muted-foreground/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="font-heading text-sm font-medium text-foreground/75">
                    {renderInline(step, `shift-before-${index}`)}
                  </p>
                </div>
              ))}
            </div>
            {beforeData.prose.length > 0 && (
              <ShiftProse content={beforeData.prose.join("\n")} />
            )}
          </Reveal>
        )}

        {afterData && (
          <Reveal variant="body" delay={0.16} className="border-l border-primary/45 pl-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
              After / the system
            </p>
            <div className="mt-5 space-y-5">
              {afterData.steps.map((step, index) => (
                <div key={step} className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] font-semibold text-primary/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="font-heading text-sm font-semibold text-foreground">
                    {renderInline(step, `shift-after-${index}`)}
                  </p>
                </div>
              ))}
            </div>
            {afterData.prose.length > 0 && (
              <ShiftProse content={afterData.prose.join("\n")} />
            )}
          </Reveal>
        )}
      </div>
    </CaseSection>
  );
}
