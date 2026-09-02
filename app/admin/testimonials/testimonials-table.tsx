"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2, Globe, GlobeLock } from "lucide-react";
import { cn } from "@/lib/utils";
import { publishTestimonial, unpublishTestimonial, deleteTestimonial } from "./actions";

interface TestimonialRow {
  id: string;
  quote: string;
  client_name: string;
  company: string;
  published: boolean;
  sort_order: number;
  project_id: string | null;
}

export function TestimonialsTable({
  testimonials,
  heroTestimonialId,
}: {
  testimonials: TestimonialRow[];
  heroTestimonialId: string | null;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Quote</th>
            <th className="px-4 py-3 text-left font-medium">Client</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Order</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t) => (
            <TestimonialRowItem
              key={t.id}
              testimonial={t}
              isHero={t.id === heroTestimonialId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TestimonialRowItem({
  testimonial,
  isHero,
}: {
  testimonial: TestimonialRow;
  isHero: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handlePublishToggle() {
    startTransition(async () => {
      if (testimonial.published) {
        await unpublishTestimonial(testimonial.id);
      } else {
        await publishTestimonial(testimonial.id);
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete testimonial from "${testimonial.client_name}"?`)) return;
    startTransition(async () => {
      await deleteTestimonial(testimonial.id);
    });
  }

  const shortQuote =
    testimonial.quote.length > 60
      ? testimonial.quote.slice(0, 60) + "..."
      : testimonial.quote;

  return (
    <tr className={cn("border-b border-border transition-opacity", isPending && "opacity-50")}>
      <td className="max-w-xs px-4 py-3 text-muted-foreground">
        &ldquo;{shortQuote}&rdquo;
      </td>
      <td className="px-4 py-3">
        <p className="font-medium">{testimonial.client_name}</p>
        {testimonial.company && (
          <p className="text-xs text-muted-foreground">{testimonial.company}</p>
        )}
        {isHero && (
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            Homepage Hero
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            testimonial.published
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          )}
        >
          {testimonial.published ? (
            <><Globe className="h-3 w-3" /> Published</>
          ) : (
            <><GlobeLock className="h-3 w-3" /> Draft</>
          )}
        </span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{testimonial.sort_order}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/testimonials/${testimonial.id}`}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handlePublishToggle}
            disabled={isPending}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title={testimonial.published ? "Unpublish" : "Publish"}
          >
            {testimonial.published ? <GlobeLock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
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
