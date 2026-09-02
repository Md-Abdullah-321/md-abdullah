import { renderInline, RichText } from "@/components/ui/rich-text";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CaseSection, SectionHeading } from "./editorial";

/* ─── Structured Sequences ─────────────────────────────
 * Layout C: the homepage's numbered sequence language —
 * divide-y rows with mono indexes for the workflow, and
 * a numbered left rail for the architecture chain.
 * Both fall back to rich text when the stored content
 * does not match the structured shape.
 */

/* ─── Workflow: numbered editorial sequence ──────────── */

export function WorkflowSteps({ content }: { content: string }) {
  const lines = content.replace(/\r/g, "").split("\n");
  const items: string[] = [];
  const rest: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (match) items.push(match[1]);
    else rest.push(trimmed);
  }

  // Not a numbered list — render as plain rich text
  if (items.length === 0) {
    return (
      <CaseSection>
        <SectionHeading label="04 / WORKFLOW" title="How it works" />
        <Reveal variant="body" className="mt-8 border-t border-border/60 pt-8">
          <RichText content={content} />
        </Reveal>
      </CaseSection>
    );
  }

  return (
    <CaseSection>
      <SectionHeading label="04 / WORKFLOW" title="How it works" />
      <RevealGroup as="ol" className="mt-10 border-t border-border/80" stagger={0.05}>
        {items.map((item, index) => (
          <RevealItem
            key={index}
            as="li"
            variant="item"
            className="grid grid-cols-[2.75rem_1fr] gap-x-5 border-b border-border/80 py-4 sm:grid-cols-[3.5rem_1fr] sm:py-5"
          >
            <span className="pt-0.5 font-mono text-xs font-semibold text-primary sm:text-sm">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-sm leading-relaxed text-foreground/85 sm:text-base">
              {renderInline(item, `workflow-${index}`)}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
      {rest.length > 0 && (
        <Reveal variant="body" className="mt-8">
          <RichText content={rest.join("\n")} />
        </Reveal>
      )}
    </CaseSection>
  );
}

/* ─── Architecture: numbered system chain ────────────── */

type FlowElement =
  | { kind: "item"; text: string }
  | { kind: "arrow" }
  | { kind: "prose"; text: string };

function parseArchitecture(content: string): FlowElement[] | null {
  const lines = content.replace(/\r/g, "").split("\n").map((l) => l.trim());
  const isArrow = (line: string) => line === "↓";

  // Only treat as a sequence when the content actually uses ↓ separators
  if (!lines.some(isArrow)) return null;

  // A line belongs to the sequence when its nearest non-blank
  // neighbour above or below is a ↓ separator.
  const sequenceLines = new Set<number>();
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i] || isArrow(lines[i])) continue;
    let next = i + 1;
    while (next < lines.length && lines[next] === "") next++;
    let prev = i - 1;
    while (prev >= 0 && lines[prev] === "") prev--;
    if (
      (next < lines.length && isArrow(lines[next])) ||
      (prev >= 0 && isArrow(lines[prev]))
    ) {
      sequenceLines.add(i);
    }
  }

  const elements: FlowElement[] = [];
  let prose: string[] = [];

  const flushProse = () => {
    if (prose.length > 0) {
      elements.push({ kind: "prose", text: prose.join("\n") });
      prose = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === "") {
      flushProse();
      continue;
    }
    if (isArrow(line)) {
      flushProse();
      elements.push({ kind: "arrow" });
      continue;
    }
    if (sequenceLines.has(i)) {
      flushProse();
      elements.push({ kind: "item", text: line });
      continue;
    }
    prose.push(line);
  }
  flushProse();

  return elements;
}

/** Ordinal position of each sequence item, computed ahead of rendering. */
function itemOrdinals(elements: FlowElement[]): Map<number, number> {
  const ordinals = new Map<number, number>();
  let ordinal = 0;
  elements.forEach((element, index) => {
    if (element.kind === "item") {
      ordinal += 1;
      ordinals.set(index, ordinal);
    }
  });
  return ordinals;
}

export function ArchitectureFlow({ content }: { content: string }) {
  const elements = parseArchitecture(content);

  if (!elements) {
    return (
      <CaseSection muted>
        <SectionHeading
          label="05 / ARCHITECTURE"
          title="The system behind it"
        />
        <Reveal variant="body" className="mt-8 border-t border-border/60 pt-8">
          <RichText content={content} />
        </Reveal>
      </CaseSection>
    );
  }

  const ordinals = itemOrdinals(elements);

  return (
    <CaseSection muted>
      <SectionHeading label="05 / ARCHITECTURE" title="The system behind it" />
      <Reveal variant="section" className="mt-10 border-l border-primary/30 pl-5 sm:pl-7">
        <ol>
          {elements.map((element, index) => {
            if (element.kind === "arrow") {
              return (
                <li
                  key={index}
                  className="grid grid-cols-[2rem_1fr] gap-3 py-1"
                  aria-hidden="true"
                >
                  <span />
                  <span className="font-mono text-xs text-primary">↓</span>
                </li>
              );
            }
            if (element.kind === "item") {
              return (
                <li
                  key={index}
                  className="grid grid-cols-[2rem_1fr] items-baseline gap-3 py-1.5"
                >
                  <span className="font-mono text-[10px] text-muted-foreground/55">
                    {String(ordinals.get(index) ?? 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-sm text-foreground/85 sm:text-base">
                    {renderInline(element.text, `arch-${index}`)}
                  </span>
                </li>
              );
            }
            return null;
          })}
        </ol>
        {elements
          .filter((element) => element.kind === "prose")
          .map((element, index) => (
            <div key={`prose-${index}`} className="mt-8 border-t border-border/60 pt-8">
              <RichText
                content={(element as { kind: "prose"; text: string }).text}
              />
            </div>
          ))}
      </Reveal>
    </CaseSection>
  );
}
