"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { createService, updateService } from "./actions";

interface ServiceData {
  id?: string;
  title: string;
  slug: string;
  short_description: string;
  problem: string;
  solution: string;
  icon_name: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

const initialResult = { success: false, error: undefined as string | undefined };

const ICON_OPTIONS = [
  { value: "", label: "None" },
  { value: "users", label: "Users (CRM)" },
  { value: "zap", label: "Zap (Automation)" },
  { value: "cable", label: "Cable (Integration)" },
  { value: "bot", label: "Bot (AI)" },
  { value: "code", label: "Code (Custom Software)" },
  { value: "wrench", label: "Wrench (Tools)" },
  { value: "globe", label: "Globe (Web)" },
  { value: "database", label: "Database" },
  { value: "settings", label: "Settings" },
];

export function ServiceForm({ service }: { service?: ServiceData }) {
  const isEditing = !!service?.id;
  const boundAction = isEditing
    ? updateService.bind(null, service!.id!)
    : createService;

  const [state, formAction, isPending] = useActionState(boundAction, initialResult);

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      {state.success && isEditing && (
        <div className="rounded-md bg-success/10 px-4 py-3 text-sm text-success">
          Service saved successfully.
        </div>
      )}

      {/* Basic Info */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Service Details</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={service?.title ?? ""}
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium">
              Slug <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              defaultValue={service?.slug ?? ""}
              placeholder="auto-generated-from-title"
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div>
          <label htmlFor="short_description" className="block text-sm font-medium">
            Short Description
          </label>
          <textarea
            id="short_description"
            name="short_description"
            rows={2}
            defaultValue={service?.short_description ?? ""}
            placeholder="Brief overview for listings"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="icon_name" className="block text-sm font-medium">
            Icon
          </label>
          <select
            id="icon_name"
            name="icon_name"
            defaultValue={service?.icon_name ?? ""}
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      {/* Description */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Service Content</legend>

        <div>
          <label htmlFor="problem" className="block text-sm font-medium">
            Problem
          </label>
          <textarea
            id="problem"
            name="problem"
            rows={3}
            defaultValue={service?.problem ?? ""}
            placeholder="What business problem signals a need for this service?"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="solution" className="block text-sm font-medium">
            Solution / Approach
          </label>
          <textarea
            id="solution"
            name="solution"
            rows={3}
            defaultValue={service?.solution ?? ""}
            placeholder="What do you build or improve for this service?"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </fieldset>

      {/* Publishing */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Publishing</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              defaultChecked={service?.published ?? false}
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="published" className="text-sm font-medium">Published</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={service?.featured ?? false}
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="featured" className="text-sm font-medium">Featured on homepage</label>
          </div>
          <div>
            <label htmlFor="sort_order" className="block text-sm font-medium">Sort Order</label>
            <input
              type="number"
              id="sort_order"
              name="sort_order"
              defaultValue={service?.sort_order ?? 0}
              className="mt-1.5 block w-20 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </fieldset>

      {/* Submit */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button type="submit" loading={isPending}>
          {isEditing ? "Save Changes" : "Create Service"}
        </Button>
        <Button variant="ghost" asChild>
          <a href="/admin/services">Cancel</a>
        </Button>
      </div>
    </form>
  );
}
