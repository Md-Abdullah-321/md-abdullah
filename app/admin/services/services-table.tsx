"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2, Globe, GlobeLock } from "lucide-react";
import { cn } from "@/lib/utils";
import { publishService, unpublishService, deleteService } from "./actions";

interface ServiceRow {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  sort_order: number;
  updated_at: string;
}

export function ServicesTable({ services }: { services: ServiceRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Title</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Featured</th>
            <th className="px-4 py-3 text-left font-medium">Order</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <ServiceRowItem key={service.id} service={service} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ServiceRowItem({ service }: { service: ServiceRow }) {
  const [isPending, startTransition] = useTransition();

  function handlePublishToggle() {
    startTransition(async () => {
      if (service.published) {
        await unpublishService(service.id);
      } else {
        await publishService(service.id);
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${service.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteService(service.id);
    });
  }

  return (
    <tr className={cn("border-b border-border transition-opacity", isPending && "opacity-50")}>
      <td className="px-4 py-3 font-medium">{service.title}</td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            service.published
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          )}
        >
          {service.published ? (
            <><Globe className="h-3 w-3" /> Published</>
          ) : (
            <><GlobeLock className="h-3 w-3" /> Draft</>
          )}
        </span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {service.featured ? "Yes" : "—"}
      </td>
      <td className="px-4 py-3 text-muted-foreground">{service.sort_order}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/services/${service.id}`}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handlePublishToggle}
            disabled={isPending}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title={service.published ? "Unpublish" : "Publish"}
          >
            {service.published ? <GlobeLock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
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
