"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  applyHeading,
  applyLink,
  applyListToggle,
  applyWrap,
  detectHeading,
  detectListMarker,
  getLineRange,
  handleBackspaceAtListStart,
  handleEnterInList,
  insertStr,
  isValidUrl,
  normalizePastedText,
  softBreak,
  type ListKind,
  type Snapshot,
} from "./editor-utils";

type RichTextFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
};

type HistoryRef = {
  undo: Snapshot[];
  redo: Snapshot[];
  burstTimer: ReturnType<typeof setTimeout> | null;
};

const TYPING_BURST_MS = 600;
const HISTORY_LIMIT = 100;

export function RichTextField({ id, name, label, defaultValue = "", rows = 5, placeholder }: RichTextFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const history = useRef<HistoryRef>({ undo: [], redo: [], burstTimer: null });
  const [historyLengths, setHistoryLengths] = useState({ undo: 0, redo: 0 });
  const [lineState, setLineState] = useState<{
    marker: ReturnType<typeof detectListMarker>;
    heading: 1 | 2 | null;
  } | null>(null);

  const syncHistoryLengths = useCallback(() => {
    setHistoryLengths({
      undo: history.current.undo.length,
      redo: history.current.redo.length,
    });
  }, []);

  const updateLineState = useCallback(() => {
    const field = ref.current;
    if (!field) return;
    const line = getLineRange(field.value, field.selectionStart);
    setLineState({
      marker: detectListMarker(line.text),
      heading: detectHeading(line.text),
    });
  }, []);

  /* ─── History ────────────────────────────────────────── */

  const pushHistory = useCallback((from: Snapshot) => {
    const stack = history.current.undo;
    const last = stack[stack.length - 1];
    if (last && last.value === from.value) return;
    stack.push(from);
    if (stack.length > HISTORY_LIMIT) stack.shift();
    history.current.redo = [];
    syncHistoryLengths();
  }, [syncHistoryLengths]);

  const readSnapshot = useCallback((): Snapshot => {
    const field = ref.current;
    if (!field) return { value: "", start: 0, end: 0 };
    return { value: field.value, start: field.selectionStart, end: field.selectionEnd };
  }, []);

  const autoGrow = useCallback((field: HTMLTextAreaElement) => {
    field.style.height = "0px";
    const content = field.scrollHeight;
    const cap = Math.max(rows * 24, 320);
    field.style.height = `${Math.min(content, cap)}px`;
  }, [rows]);

  const writeValue = useCallback(
    (value: string, start: number, end: number) => {
      const field = ref.current;
      if (!field) return;
      field.value = value;
      const s = Math.min(start, value.length);
      const e = Math.min(end, value.length);
      field.setSelectionRange(s, e);
      autoGrow(field);
      field.focus();
    },
    [autoGrow]
  );

  /** Run a structural command: record the pre-state, then apply the result. */
  const commit = useCallback(
    (result: Snapshot | null) => {
      if (!result) return;
      pushHistory(readSnapshot());
      writeValue(result.value, result.start, result.end);
    },
    [pushHistory, readSnapshot, writeValue]
  );

  const undo = useCallback(() => {
    const previous = history.current.undo.pop();
    if (!previous) return;
    history.current.redo.push(readSnapshot());
    writeValue(previous.value, previous.start, previous.end);
    syncHistoryLengths();
  }, [readSnapshot, writeValue, syncHistoryLengths]);

  const redo = useCallback(() => {
    const next = history.current.redo.pop();
    if (!next) return;
    history.current.undo.push(readSnapshot());
    writeValue(next.value, next.start, next.end);
    syncHistoryLengths();
  }, [readSnapshot, writeValue, syncHistoryLengths]);

  /* ─── Toolbar commands ───────────────────────────────── */

  const runWrap = useCallback(
    (before: string, after = before) => {
      const field = ref.current;
      if (!field) return;
      commit(applyWrap(field.value, field.selectionStart, field.selectionEnd, before, after));
    },
    [commit]
  );

  const runHeading = useCallback(
    (level: 1 | 2) => {
      const field = ref.current;
      if (!field) return;
      commit(applyHeading(field.value, field.selectionStart, field.selectionEnd, level));
    },
    [commit]
  );

  const runList = useCallback(
    (kind: ListKind) => {
      const field = ref.current;
      if (!field) return;
      commit(applyListToggle(field.value, field.selectionStart, field.selectionEnd, kind));
    },
    [commit]
  );

  const runLink = useCallback(() => {
    const field = ref.current;
    if (!field) return;
    const selected = field.value.slice(field.selectionStart, field.selectionEnd);
    const label = selected || "link";
    const url = window.prompt(`Enter the URL for "${label}":`, "https://");
    if (url === null) return; // cancelled
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!isValidUrl(trimmed)) {
      window.alert("Links must start with https://, http:// or mailto:");
      return;
    }
    commit(applyLink(field.value, field.selectionStart, field.selectionEnd, trimmed));
  }, [commit]);

  /* ─── Keyboard handling ──────────────────────────────── */

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const field = ref.current;
      if (!field) return;
      const mod = event.metaKey || event.ctrlKey;
      const key = event.key;

      if (mod && key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }
      if ((mod && event.shiftKey && key.toLowerCase() === "z") || (mod && key.toLowerCase() === "y")) {
        event.preventDefault();
        redo();
        return;
      }
      if ((event.nativeEvent as unknown as { isComposing?: boolean }).isComposing || mod || event.altKey) return;

      if (key === "Enter") {
        if (event.shiftKey) {
          event.preventDefault();
          commit(softBreak(field.value, field.selectionStart, field.selectionEnd));
          return;
        }
        const result = handleEnterInList(field.value, field.selectionStart, field.selectionEnd);
        if (result) {
          event.preventDefault();
          commit(result);
        }
        return; // plain Enter → native newline
      }

      if (key === "Backspace") {
        const result = handleBackspaceAtListStart(field.value, field.selectionStart, field.selectionEnd);
        if (result) {
          event.preventDefault();
          commit(result);
        }
        return; // otherwise native backspace
      }

      // Printable character → coalesce typing into a single undo step.
      if (key.length === 1 && !history.current.burstTimer) {
        pushHistory(readSnapshot());
        history.current.burstTimer = setTimeout(() => {
          history.current.burstTimer = null;
        }, TYPING_BURST_MS);
      }
    },
    [commit, pushHistory, readSnapshot, undo, redo]
  );

  const onPaste = useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      event.preventDefault();
      const field = ref.current;
      if (!field) return;
      const clean = normalizePastedText(event.clipboardData.getData("text/plain"));
      if (clean === "") {
        field.focus();
        return;
      }
      const { selectionStart: start, selectionEnd: end } = field;
      commit({
        value: insertStr(field.value, clean, start, end),
        start: start + clean.length,
        end: start + clean.length,
      });
    },
    [commit]
  );

  const autoGrowCurrent = useCallback(() => {
    const field = ref.current;
    if (field) autoGrow(field);
  }, [autoGrow]);

  useEffect(() => {
    autoGrowCurrent();
  }, [autoGrowCurrent]);

  useEffect(() => {
    const burstTimer = history.current.burstTimer;
    return () => {
      if (burstTimer) clearTimeout(burstTimer);
    };
  }, []);

  /* ─── Render ─────────────────────────────────────────── */

  const bulletActive = lineState?.marker?.kind === "bullet" || false;
  const orderedActive = lineState?.marker?.kind === "ordered" || false;
  const headingActive = lineState?.heading === 1 || false;
  const subheadingActive = lineState?.heading === 2 || false;
  const hasHistoryUndo = historyLengths.undo > 0;
  const hasHistoryRedo = historyLengths.redo > 0;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1.5 overflow-hidden rounded-md border border-input bg-background shadow-xs focus-within:ring-2 focus-within:ring-ring">
        <div
          role="toolbar"
          aria-label="Formatting options"
          aria-controls={id}
          className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 p-1.5"
        >
          <ToolbarButton label="Bold" title="Bold" onPress={() => runWrap("**")} pressed={false}>
            <span className="font-bold">B</span>
          </ToolbarButton>
          <ToolbarButton label="Italic" title="Italic" onPress={() => runWrap("_")} pressed={false}>
            <span className="italic">I</span>
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton label="Heading" title="Heading" onPress={() => runHeading(1)} pressed={headingActive}>
            H
          </ToolbarButton>
          <ToolbarButton label="Subheading" title="Subheading" onPress={() => runHeading(2)} pressed={subheadingActive}>
            H₂
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton label="Unordered list" title="Unordered list" onPress={() => runList("bullet")} pressed={bulletActive}>
            •
          </ToolbarButton>
          <ToolbarButton label="Ordered list" title="Ordered list" onPress={() => runList("ordered")} pressed={orderedActive}>
            1.
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton label="Add link" title="Add link" onPress={runLink} pressed={false}>
            Link
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton label="Undo" title="Undo (Ctrl/⌘+Z)" onPress={undo} disabled={!hasHistoryUndo} pressed={false}>
            ↶
          </ToolbarButton>
          <ToolbarButton label="Redo" title="Redo (Ctrl/⌘+Shift+Z)" onPress={redo} disabled={!hasHistoryRedo} pressed={false}>
            ↷
          </ToolbarButton>
        </div>
        <textarea
          ref={ref}
          id={id}
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onInput={() => {
            autoGrowCurrent();
            updateLineState();
          }}
          onFocus={() => {
            autoGrowCurrent();
            updateLineState();
          }}
          onMouseUp={updateLineState}
          onKeyUp={updateLineState}
          onClick={updateLineState}
          onSelect={updateLineState}
          className="block w-full resize-none overflow-y-auto border-0 bg-transparent px-3 py-2 text-sm leading-6 outline-none"
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Supports paragraphs, **bold**, _italic_, # headings, - / 1. lists, and [links](https://…).
        Enter continues a list; Enter on an empty item ends it; Shift+Enter adds a line break; Ctrl/⌘+Z undoes.
      </p>
    </div>
  );
}

function ToolbarDivider() {
  return <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-border" />;
}

function ToolbarButton({
  label,
  title,
  onPress,
  disabled = false,
  pressed,
  children,
}: {
  label: string;
  title: string;
  onPress: () => void;
  disabled?: boolean;
  pressed: boolean;
  children: React.ReactNode;
}) {
  const cls =
    "inline-flex items-center justify-center rounded px-2 py-1 text-xs leading-4 text-foreground/80 transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-background aria-pressed:text-primary disabled:pointer-events-none disabled:opacity-40";
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onPress}
      className={cls}
    >
      {children}
    </button>
  );
}
