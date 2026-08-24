"use client";

import { useRef } from "react";

type RichTextFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
};

export function RichTextField({ id, name, label, defaultValue = "", rows = 5, placeholder }: RichTextFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function wrap(before: string, after = before) {
    const field = ref.current;
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const selected = field.value.slice(start, end) || "text";
    field.setRangeText(`${before}${selected}${after}`, start, end, "select");
    field.focus();
  }

  function insertLine(prefix: string) {
    const field = ref.current;
    if (!field) return;
    const start = field.selectionStart;
    field.setRangeText(`${prefix}${field.value.slice(start, field.selectionEnd) || "item"}`, start, field.selectionEnd, "select");
    field.focus();
  }

  return <div><label htmlFor={id} className="block text-sm font-medium">{label}</label><div className="mt-1.5 overflow-hidden rounded-md border border-input bg-background shadow-xs focus-within:ring-2 focus-within:ring-ring"><div className="flex flex-wrap gap-1 border-b border-border bg-muted/40 p-1.5"><button type="button" onClick={() => wrap("**")} className="rounded px-2 py-1 text-xs font-bold hover:bg-background" title="Bold">B</button><button type="button" onClick={() => wrap("_")} className="rounded px-2 py-1 text-xs italic hover:bg-background" title="Italic">I</button><button type="button" onClick={() => insertLine("- ")} className="rounded px-2 py-1 text-xs hover:bg-background" title="Bullet list">List</button><button type="button" onClick={() => insertLine("1. ")} className="rounded px-2 py-1 text-xs hover:bg-background" title="Numbered list">1.</button><button type="button" onClick={() => wrap("[", "](https://example.com)" )} className="rounded px-2 py-1 text-xs hover:bg-background" title="Link">Link</button></div><textarea ref={ref} id={id} name={name} rows={rows} defaultValue={defaultValue} placeholder={placeholder} className="block w-full resize-y border-0 bg-transparent px-3 py-2 text-sm leading-6 outline-none" /></div><p className="mt-1 text-xs text-muted-foreground">Supports paragraphs, line breaks, **bold**, _italic_, lists, and Markdown links.</p></div>;
}
