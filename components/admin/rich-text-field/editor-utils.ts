/* ─── Markdown Editor Core ─────────────────────────────
 * Pure, deterministic text/selection operations for the
 * admin RichTextField. No React, no DOM: every operation
 * receives the current value + selection and returns the
 * next value + selection (or null to let the browser run
 * its default behavior).
 *
 * The output dialect is exactly what the public Markdown
 * renderer (components/ui/rich-text.tsx) understands:
 *   - "- " / "* " unordered list lines
 *   - "1. " / "1) " ordered list lines
 *   - "# "  → h3 heading line,  "## " → h4 heading line
 *   - two trailing spaces = hard line break inside a
 *     paragraph / list item continuation
 * A list item is one physical line; nested lists are not
 * part of the content model and are never produced.
 */

export type Snapshot = { value: string; start: number; end: number };

export type ListKind = "bullet" | "ordered";

type ListMarker = {
  kind: ListKind;
  indent: string;
  markerEnd: number;
  number?: number;
  hasContent: boolean;
};

/* ─── Low-level string helpers ───────────────────────── */

export function insertStr(value: string, insertion: string, start: number, end: number) {
  return value.slice(0, start) + insertion + value.slice(end);
}

/* ─── Line helpers ───────────────────────────────────── */

export function getLineRange(
  value: string,
  position: number
): { start: number; end: number; text: string } {
  const start = value.lastIndexOf("\n", position - 1) + 1;
  const rawEnd = value.indexOf("\n", position);
  const end = rawEnd === -1 ? value.length : rawEnd;
  return { start, end, text: value.slice(start, end) };
}

const LIST_RE = /^(\s*)([-*]|\d+[.)])(\s+)(.*)$/;

export function detectListMarker(line: string): ListMarker | null {
  const match = line.match(LIST_RE);
  if (!match) return null;
  const indent = match[1];
  const marker = match[2];
  const kind: ListKind = marker === "-" || marker === "*" ? "bullet" : "ordered";
  return {
    kind,
    indent,
    markerEnd: indent.length + marker.length + match[3].length,
    number: kind === "ordered" ? parseInt(marker, 10) : undefined,
    hasContent: match[4].trim() !== "",
  };
}

/** Detect a supported heading prefix ("# " → 1, "## " → 2). Other heading
 *  depths (# # # …) are outside the content model and return null. */
export function detectHeading(line: string): 1 | 2 | null {
  const match = line.match(/^(\s*)(#{1,6})(\s+)(.*)$/);
  if (!match) return null;
  const level = match[2].length;
  if (level === 1) return 1;
  if (level === 2) return 2;
  return null;
}

/* ─── Selection expansion ────────────────────────────── */

/** Expand a selection to cover whole lines. A collapsed caret acts on its
 *  own line. The returned end points just before the final newline. */
export function expandToLines(
  value: string,
  start: number,
  end: number
): { start: number; end: number } {
  const selStart = Math.min(start, end);
  const selEnd = Math.max(start, end);
  const hasSelection = selStart !== selEnd;

  const rangeStart = value.lastIndexOf("\n", selStart - 1) + 1;

  let rangeEnd: number;
  if (hasSelection) {
    // The last selected character may be the newline that ends a line;
    // expanding from it lands exactly on the boundary we want.
    const lastChar = Math.max(selStart, selEnd - 1);
    const nl = value.indexOf("\n", lastChar);
    rangeEnd = nl === -1 ? value.length : nl;
  } else {
    const nl = value.indexOf("\n", selStart);
    rangeEnd = nl === -1 ? value.length : nl;
  }

  return { start: rangeStart, end: rangeEnd };
}

/* ─── Block prefix stripping (shared by conversions) ── */

/** Remove any list marker or heading marker from a single line, keeping the
 *  marker's indentation (list) or the line's own indent (heading). */
function stripBlockPrefix(line: string): { indent: string; content: string } {
  const marker = detectListMarker(line);
  if (marker) return { indent: marker.indent, content: line.slice(marker.markerEnd).trimStart() };
  const heading = line.match(/^(\s*)#{1,6}(\s+)(.*)$/);
  if (heading) return { indent: heading[1], content: heading[3].trimStart() };
  return { indent: "", content: line.trim() };
}

/* ─── List toggling ──────────────────────────────────── */

/** Toggle a list kind over the affected lines of a selection.
 *  - Already all the requested kind → remove the markers (plain lines).
 *  - Otherwise → normalize each line (strip any existing list/heading
 *    marker) and prefix "- " or sequential "1. 2. 3. …".
 *  - A caret on an empty line starts a fresh empty item of that kind. */
export function applyListToggle(
  value: string,
  start: number,
  end: number,
  kind: ListKind
): Snapshot | null {
  const range = expandToLines(value, start, end);
  const block = value.slice(range.start, range.end);

  if (block === "") {
    // Empty line under the caret → start a fresh list item.
    const marker = kind === "bullet" ? "- " : "1. ";
    const next = insertStr(value, marker, range.start, range.end);
    const caret = range.start + marker.length;
    return { value: next, start: caret, end: caret };
  }

  const lines = block.split("\n");
  const nonEmpty = lines.filter((line) => line.trim() !== "");
  if (nonEmpty.length === 0) return null;

  const allMatch = nonEmpty.every((line) => {
    const marker = detectListMarker(line);
    return marker !== null && marker.kind === kind;
  });

  let next: string;
  if (allMatch) {
    // Toggle off: remove markers, preserving the item text and indent.
    next = lines
      .map((line) => {
        if (line.trim() === "") return "";
        const marker = detectListMarker(line);
        if (marker && marker.kind === kind) {
          return marker.indent + line.slice(marker.markerEnd);
        }
        return line;
      })
      .join("\n");
  } else {
    // Convert to the requested list kind.
    let number = 1;
    next = lines
      .map((line) => {
        if (line.trim() === "") {
          number = 1; // a blank line restarts the visual numbering run
          return "";
        }
        const { indent, content } = stripBlockPrefix(line);
        if (kind === "bullet") return `${indent}- ${content}`;
        const n = number;
        number += 1;
        return `${indent}${n}. ${content}`;
      })
      .join("\n");
  }

  return {
    value: insertStr(value, next, range.start, range.end),
    start: range.start,
    end: range.start + next.length,
  };
}

/* ─── Heading toggling ───────────────────────────────── */

/** Toggle a heading level over the affected lines ("#" → h3, "##" → h4).
 *  Toggling the same level again removes it. Any deeper heading is
 *  normalized down to the requested level. */
export function applyHeading(
  value: string,
  start: number,
  end: number,
  level: 1 | 2
): Snapshot | null {
  const range = expandToLines(value, start, end);
  const block = value.slice(range.start, range.end);
  if (block.trim() === "") return null;

  const lines = block.split("\n");
  const nonEmpty = lines.filter((line) => line.trim() !== "");
  const allMatch = nonEmpty.every((line) => detectHeading(line) === level);
  const prefix = level === 1 ? "# " : "## ";

  const next = lines
    .map((line) => {
      if (line.trim() === "") return "";
      const existing = detectHeading(line);
      if (allMatch && existing === level) {
        return line.replace(/^(\s*)#{1,2}\s+/, "$1");
      }
      const { content } = stripBlockPrefix(line);
      return prefix + content;
    })
    .join("\n");

  return {
    value: insertStr(value, next, range.start, range.end),
    start: range.start,
    end: range.start + next.length,
  };
}

/* ─── Inline wrap toggles (bold / italic) ────────────── */

const WRAP_VARIANTS: Record<string, string[]> = {
  "**": ["**", "__"],
  _: ["_", "*"],
};

/** Wrap the selection in `before`/`after` delimiters. When the selection is
 *  already wrapped in a variant of those delimiters — or sits entirely inside
 *  such a token — the wrapper is removed (toggle). A collapsed caret inserts
 *  an empty pair with the caret between. */
export function applyWrap(
  value: string,
  start: number,
  end: number,
  before: string,
  after = before
): Snapshot {
  const selected = value.slice(start, end);
  const variants = WRAP_VARIANTS[before] ?? [before];

  // 1) Selection exactly equals a wrapped token (or the visible text sits
  //    flush between an identical pair of delimiters) → toggle off.
  for (const variant of variants) {
    const closing = after;
    if (selected.startsWith(variant) && selected.endsWith(closing)) {
      const inner = selected.slice(variant.length, selected.length - closing.length);
      return { value: insertStr(value, inner, start, end), start, end: start + inner.length };
    }
  }

  // 2) Selection sits entirely inside an existing wrapped token (e.g. the
  //    visible word inside "**word**") → remove that token's delimiters.
  for (const variant of variants) {
    const open = value.lastIndexOf(variant, start - variant.length);
    if (open === -1 || open > start) continue;
    const tokenStart = open;
    const afterOpen = open + variant.length;
    const close = value.indexOf(after, end);
    if (close === -1) continue;
    const tokenEnd = close + after.length;
    if (tokenStart <= start && end <= tokenEnd && afterOpen <= start) {
      const inner = value.slice(afterOpen, close);
      const next = value.slice(0, tokenStart) + inner + value.slice(tokenEnd);
      const selStart = Math.max(start - tokenStart, 0);
      const selEnd = selStart + (end - start);
      return { value: next, start: selStart, end: selEnd };
    }
  }

  if (selected === "") {
    const replacement = `${before}${after}`;
    const next = insertStr(value, replacement, start, end);
    const caret = start + before.length;
    return { value: next, start: caret, end: caret };
  }

  const replacement = `${before}${selected}${after}`;
  return { value: insertStr(value, replacement, start, end), start: start + before.length, end: end + before.length };
}

/* ─── Links ──────────────────────────────────────────── */

export function isValidUrl(value: string): boolean {
  return /^(https?:\/\/[^\s]+|mailto:[^\s]+)$/i.test(value);
}

type LinkToken = {
  urlStart: number;
  urlEnd: number;
};

/** When the caret rests inside an existing [label](url) token, return its
 *  URL span so the Link command can replace just the URL in place. */
function findLinkTokenAt(value: string, pos: number): LinkToken | null {
  const before = value.slice(0, pos);
  const open = before.lastIndexOf("[");
  if (open === -1) return null;
  const closeBracket = value.indexOf("]", open);
  if (closeBracket === -1 || closeBracket + 1 >= value.length) return null;
  if (value[closeBracket + 1] !== "(") return null;
  const parenClose = value.indexOf(")", closeBracket + 2);
  if (parenClose === -1) return null;
  // The token must actually span the caret (caret inside label or URL).
  if (parenClose < pos) return null;
  const url = value.slice(closeBracket + 2, parenClose);
  if (!isValidUrl(url)) return null;
  return { urlStart: closeBracket + 2, urlEnd: parenClose };
}

/** Apply a link: replace the URL of an existing link token under the caret,
 *  wrap the selected text, or insert a fresh [label](url). `url` must already
 *  have passed isValidUrl. */
export function applyLink(value: string, start: number, end: number, url: string): Snapshot {
  if (start === end) {
    const token = findLinkTokenAt(value, start);
    if (token) {
      const next = insertStr(value, url, token.urlStart, token.urlEnd);
      return { value: next, start, end };
    }
    const replacement = `[link](${url})`;
    const next = insertStr(value, replacement, start, end);
    const caret = start + replacement.length;
    return { value: next, start: caret, end: caret };
  }

  const selected = value.slice(start, end).trim();
  if (!selected) return { value, start, end };
  const replacement = `[${selected}](${url})`;
  return { value: insertStr(value, replacement, start, end), start, end: start + replacement.length };
}

/* ─── Enter / list continuation ──────────────────────── */

function markerText(kind: ListKind, indent: string, number?: number) {
  return kind === "ordered" ? `${indent}${number ?? 1}. ` : `${indent}- `;
}

/** Remove an empty list item line. The line's trailing newline (if any) is
 *  also removed so the caret lands on the following line — ending the list
 *  without leaving an empty paragraph behind. When the empty item is the last
 *  content in the field, an empty line is preserved so the caret has a home. */
function exitEmptyListItem(value: string, line: { start: number; end: number }): Snapshot {
  const lineEnd = line.end;
  const after = value.slice(lineEnd);
  const endsWithNewline = after.startsWith("\n");
  const removeThrough = endsWithNewline ? lineEnd + 1 : lineEnd;
  const next = value.slice(0, line.start) + value.slice(removeThrough);
  const caret = line.start;
  const result = next === "" || next.endsWith("\n") ? next : `${next}\n`;
  return { value: result, start: caret, end: caret };
}

/** Enter pressed while the caret is inside a list item:
 *  - empty item → exit the list (the list ends, caret continues on a normal
 *    paragraph line; no empty bullet remains)
 *  - caret at the start of the item content → insert an empty item above
 *  - caret mid/end of content → split: content after the caret becomes a new
 *    item of the same kind below (ordered lists continue numbering). */
export function handleEnterInList(value: string, start: number, end: number): Snapshot | null {
  if (start !== end) return null; // let the browser replace the selection
  const line = getLineRange(value, start);
  const marker = detectListMarker(line.text);
  if (!marker) return null;

  const rel = start - line.start;
  const contentStart = marker.markerEnd;
  const indent = marker.indent;
  const textAfterMarker = line.text.slice(contentStart);
  const nextMarker = markerText(marker.kind, indent, marker.kind === "ordered" ? (marker.number ?? 1) + 1 : undefined);
  const aboveMarker = markerText(marker.kind, indent, marker.number);

  if (!textAfterMarker.trim()) {
    return exitEmptyListItem(value, line);
  }

  // Caret before any item content (in the marker region or at the very start
  // of the text): insert an empty item above, pushing the current item down.
  if (rel <= contentStart || !line.text.slice(contentStart, rel).trim()) {
    const replacement = `${aboveMarker}\n${nextMarker}${textAfterMarker.trimStart()}`;
    const next = value.slice(0, line.start) + replacement + value.slice(line.end);
    return { value: next, start: line.start + aboveMarker.length, end: line.start + aboveMarker.length };
  }

  // Caret inside the item text: split at the caret.
  const afterCaret = line.text.slice(rel);
  const beforeCaret = line.text.slice(contentStart, rel);
  if (afterCaret.trim()) {
    const lineMarkerPrefix = line.text.slice(0, contentStart);
    const replacement = `${lineMarkerPrefix}${beforeCaret}\n${nextMarker}${afterCaret.trimStart()}`;
    const next = value.slice(0, line.start) + replacement + value.slice(line.end);
    const caret = line.start + lineMarkerPrefix.length + beforeCaret.length + 1 + nextMarker.length;
    return { value: next, start: caret, end: caret };
  }

  // Caret at the very end of the item content: append a fresh empty item.
  const next = value.slice(0, line.end) + `\n${nextMarker}` + value.slice(line.end);
  const caret = line.end + 1 + nextMarker.length;
  return { value: next, start: caret, end: caret };
}

/* ─── Backspace at line start ────────────────────────── */

/** Backspace at the very start of a list item line:
 *  - item has text → remove the marker (the item becomes a paragraph)
 *  - empty item → delete the line and merge up into the previous line
 *  Returns null when the browser default should handle the key. */
export function handleBackspaceAtListStart(
  value: string,
  start: number,
  end: number
): Snapshot | null {
  if (start !== end) return null;
  const line = getLineRange(value, start);
  const marker = detectListMarker(line.text);
  if (!marker) return null;
  if (start > line.start) return null; // not at the very start of the line

  if (marker.hasContent) {
    // Lift the item to a plain paragraph (the marker is removed).
    const rest = line.text.slice(marker.markerEnd);
    const next = value.slice(0, line.start) + marker.indent + rest + value.slice(line.end);
    const caret = line.start + marker.indent.length;
    return { value: next, start: caret, end: caret };
  }

  // Empty item: delete the whole line including the newline after it (or
  // before it when this is the last line), merging up into the neighbours.
  if (line.start === 0 && line.end === value.length) {
    return { value: "", start: 0, end: 0 };
  }
  if (line.end === value.length) {
    // Last line: remove the preceding newline so the previous line ends the doc.
    const next = value.slice(0, line.start - 1);
    return { value: next, start: next.length, end: next.length };
  }
  const removeThrough = line.end + 1; // include the following "\n"
  const next = value.slice(0, line.start) + value.slice(removeThrough);
  return { value: next, start: line.start, end: line.start };
}

/* ─── Soft line breaks (Shift+Enter) ─────────────────── */

/** Shift+Enter:
 *  - in a paragraph → the dialect's semantic hard break (two trailing
 *    spaces + newline), which the renderer turns into a <br/> inside the
 *    same paragraph
 *  - in a list item → a marker-less indented continuation line so the list
 *    structure is never corrupted by an extra bullet
 *  - on an empty list item → exit the list, same as Enter. */
export function softBreak(value: string, start: number, end: number): Snapshot | null {
  if (start !== end) return null;
  const line = getLineRange(value, start);
  const rel = start - line.start;
  const marker = detectListMarker(line.text);

  if (marker) {
    const contentStart = marker.markerEnd;
    const content = line.text.slice(contentStart);
    if (!content.trim()) return exitEmptyListItem(value, line);

    // Insert a marker-less indented continuation line under this item. The
    // caret's line-relative offset is clamped to the content area so the
    // split never happens inside the marker itself.
    const relCaret = Math.min(Math.max(rel, contentStart), line.text.length);
    const beforeText = line.text.slice(contentStart, relCaret);
    const afterText = line.text.slice(relCaret).trimStart();
    const contIndent = marker.indent + "  ";
    const newLine =
      line.text.slice(0, contentStart) + beforeText + "\n" + contIndent + afterText;
    const next = value.slice(0, line.start) + newLine + value.slice(line.end);
    const caret = line.start + newLine.lastIndexOf("\n") + 1 + contIndent.length;
    return { value: next, start: caret, end: caret };
  }

  if (rel === 0) return null; // source-level line wrap; browser default is fine

  const before = line.text.slice(0, rel);
  const alreadyBreak = / {2}$/.test(before);
  const insertion = alreadyBreak ? "\n" : "  \n";
  const next = insertStr(value, insertion, start, end);
  const caret = start + insertion.length;
  return { value: next, start: caret, end: caret };
}

/* ─── Paste normalization ────────────────────────────── */

/** Normalize arbitrary clipboard text to clean editor content:
 *  no CR, no NBSP, no control characters, no trailing spaces (which would
 *  create phantom hard breaks), no runs of more than one blank line. */
export function normalizePastedText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+$/gm, "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+/, "") // drop indentation on the very first pasted line
    .replace(/^\n+|\n+$/g, "");
}
