"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2, Globe, GlobeLock } from "lucide-react";
import { cn } from "@/lib/utils";
import { publishProofItem, unpublishProofItem, deleteProofItem } from "./actions";

interface ProofRow {
  id: string;
  type: string;
  title: string;
  published: boolean;
  sort_order: number;
  project_id: string | null;
}

const typeLabels: Record<string, string> = {
  project: "Project",
  video: "Video",
  testimonial: "Testimonial",
  professional: "Professional",
  other: "External",
};

export function ProofTable({ items }: { items: ProofRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Title</th>
            <th className="px-4 py-3 text-left font-medium">Type</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Order</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ProofRowItem key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProofRowItem({ item }: { item: ProofRow }) {
  const [isPending, startTransition] = useTransition();

  function handlePublishToggle() {
    startTransition(async () => {
      if (item.published) {
        await unpublishProofItem(item.id);
      } else {
        await publishProofItem(item.id);
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteProofItem(item.id);
    });
  }

  return (
    <tr className={cn("border-b border-border transition-opacity", isPending && "opacity-50")}>
      <td className="px-4 py-3 font-medium">{item.title}</td>
      <td className="px-4 py-3">
        <span className="rounded-sm bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
          {typeLabels[item.type] ?? item.type}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            item.published
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          )}
        >
          {item.published ? (
            <><Globe className="h-3 w-3" /> Published</>
          ) : (
            <><GlobeLock className="h-3 w-3" /> Draft</>
          )}
        </span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{item.sort_order}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/proof/${item.id}`}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handlePublishToggle}
            disabled={isPending}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title={item.published ? "Unpublish" : "Publish"}
          >
            {item.published ? <GlobeLock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
