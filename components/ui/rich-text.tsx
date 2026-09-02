import { cn } from "@/lib/utils";

/* ─── Shared Markdown Renderer ────────────────────────
 * One rendering pipeline for all admin-controlled
 * project content. No HTML parsing: Markdown is matched
 * by pattern and everything else renders as escaped
 * React text, so raw HTML can never execute. Link URLs
 * are restricted to http(s) and mailto by the match
 * pattern itself.
 *
 * - renderInline: bold / italic / links, for titles,
 *   labels and other single-line fields.
 * - RichText: block-level rendering (paragraphs, hard
 *   breaks, headings, lists) with a per-context style
 *   variant — "detail" for long-form content, "card"
 *   for compact project cards.
 */

const INLINE_PATTERN =
  /(\[[^\]]+\]\((?:https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|\*\*[^*]+\*\*|__[^_]+__|_[^_]+_|\*[^*]+\*)/;
const LINK_ANCHORED = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)$/;

export function renderInline(text: string, keyPrefix: string) {
  const parts = text
    .split(INLINE_PATTERN)
    .filter((part) => part !== undefined && part !== "");
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    const link = part.match(LINK_ANCHORED);
    if (link)
      return (
        <a
          key={key}
          href={link[2]}
          target={link[2].startsWith("http") ? "_blank" : undefined}
          rel={link[2].startsWith("http") ? "noopener noreferrer" : undefined}
          className="underline decoration-primary/40 underline-offset-4 hover:text-primary"
        >
          {link[1]}
        </a>
      );
    if (
      (part.startsWith("**") && part.endsWith("**")) ||
      (part.startsWith("__") && part.endsWith("__"))
    )
      return (
        <strong className="font-semibold text-foreground" key={key}>
          {part.slice(2, -2)}
        </strong>
      );
    if (
      (part.startsWith("_") && part.endsWith("_")) ||
      (part.startsWith("*") && part.endsWith("*"))
    )
      return <em key={key}>{part.slice(1, -1)}</em>;
    return <span key={key}>{part}</span>;
  });
}

/** Plain-text version of inline Markdown, for contexts where formatting
 *  cannot render (SEO metadata, screen-reader fallbacks). */
export function stripInlineMarkdown(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "");
}

function normalizeContent(content: string) {
  return content
    .replace(/\r/g, "")
    .replace(/([^\n])\s+(?=\d+[.)]\s)/g, "$1\n");
}

export type RichTextVariant = "detail" | "card";

const BLOCK_HEADING = /^(#{1,3})\s+(.+)$/;
const BLOCK_ORDERED = /^\d+[.)]\s+/;
const BLOCK_UNORDERED = /^[-*]\s+/;
const BLOCK_BOUNDARY = /^\s*(?:#{1,3}\s+|\d+[.)]\s+|[-*]\s+)/;

export function RichText({
  content,
  className = "",
  variant = "detail",
}: {
  content: string;
  className?: string;
  variant?: RichTextVariant;
}) {
  const card = variant === "card";
  const lines = normalizeContent(content).split("\n");
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(BLOCK_HEADING);
    if (heading) {
      const Tag = heading[1].length === 1 ? "h3" : "h4";
      blocks.push(
        <Tag
          className={cn(
            "font-mono font-semibold text-foreground",
            card ? "text-base tracking-[-0.02em]" : "text-xl tracking-[-0.03em]"
          )}
          key={`heading-${index}`}
        >
          {renderInline(heading[2], `heading-${index}`)}
        </Tag>
      );
      index += 1;
      continue;
    }

    if (BLOCK_ORDERED.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+[.)]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+[.)]\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ol
          className={cn(
            "list-decimal marker:font-mono marker:text-primary",
            card ? "space-y-1 pl-5" : "space-y-2 pl-6"
          )}
          key={`ordered-${index}`}
        >
          {items.map((item, itemIndex) => (
            <li
              className={card ? "pl-1.5" : "pl-2"}
              key={`${index}-${itemIndex}`}
            >
              {renderInline(item, `ordered-${index}-${itemIndex}`)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (BLOCK_UNORDERED.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*]\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ul
          className={cn(
            "list-disc marker:text-primary",
            card ? "space-y-1 pl-5" : "space-y-2 pl-6"
          )}
          key={`unordered-${index}`}
        >
          {items.map((item, itemIndex) => (
            <li
              className={card ? "pl-1.5" : "pl-2"}
              key={`${index}-${itemIndex}`}
            >
              {renderInline(item, `unordered-${index}-${itemIndex}`)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Paragraph — consecutive lines join with a space; a line ending
    // in two spaces becomes a hard line break.
    const paragraph: string[] = [line];
    const hardBreakAfter: boolean[] = [/ {2}$/.test(rawLine)];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !BLOCK_BOUNDARY.test(lines[index])
    ) {
      hardBreakAfter.push(/ {2}$/.test(lines[index]));
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(
      <p key={`paragraph-${index}`}>
        {paragraph.map((lineText, lineIndex) => (
          <span key={lineIndex}>
            {renderInline(lineText, `paragraph-${index}-${lineIndex}`)}
            {hardBreakAfter[lineIndex] ? (
              <br />
            ) : lineIndex < paragraph.length - 1 ? (
              " "
            ) : null}
          </span>
        ))}
      </p>
    );
  }

  return (
    <div
      className={cn(
        card
          ? "space-y-2 text-sm leading-6 text-muted-foreground"
          : "space-y-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8",
        className
      )}
    >
      {blocks}
    </div>
  );
}
