"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { createTestimonial, updateTestimonial } from "./actions";

interface TestimonialData {
  id?: string;
  quote: string;
  client_name: string;
  client_role: string;
  company: string;
  avatar_url: string | null;
  project_id: string | null;
  published: boolean;
  sort_order: number;
}

interface Project {
  id: string;
  title: string;
}

const initialResult = { success: false, error: undefined as string | undefined };

export function TestimonialForm({
  testimonial,
  projects,
}: {
  testimonial?: TestimonialData;
  projects: Project[];
}) {
  const isEditing = !!testimonial?.id;
  const boundAction = isEditing
    ? updateTestimonial.bind(null, testimonial!.id!)
    : createTestimonial;

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
          Testimonial saved successfully.
        </div>
      )}

      {/* Quote */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Testimonial</legend>
        <div>
          <label htmlFor="quote" className="block text-sm font-medium">
            Quote <span className="text-destructive">*</span>
          </label>
          <textarea
            id="quote"
            name="quote"
            required
            rows={4}
            defaultValue={testimonial?.quote ?? ""}
            placeholder="The client's words exactly as they said them"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Preserve the client&apos;s original wording. Do not rewrite or embellish.
          </p>
        </div>
      </fieldset>

      {/* Attribution */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Attribution</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="client_name" className="block text-sm font-medium">
              Client Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              required
              defaultValue={testimonial?.client_name ?? ""}
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="client_role" className="block text-sm font-medium">
              Role <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <input
              type="text"
              id="client_role"
              name="client_role"
              defaultValue={testimonial?.client_role ?? ""}
              placeholder="e.g., Operations Manager"
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="company" className="block text-sm font-medium">
              Company <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              defaultValue={testimonial?.company ?? ""}
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="avatar_url" className="block text-sm font-medium">
              Avatar URL <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <input
              type="url"
              id="avatar_url"
              name="avatar_url"
              defaultValue={testimonial?.avatar_url ?? ""}
              placeholder="https://..."
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </fieldset>

      {/* Related project */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Related Project</legend>
        <div>
          <label htmlFor="project_id" className="block text-sm font-medium">
            Project <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <select
            id="project_id"
            name="project_id"
            defaultValue={testimonial?.project_id ?? ""}
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">No related project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      {/* Publishing */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Publishing</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              defaultChecked={testimonial?.published ?? false}
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="published" className="text-sm font-medium">Published</label>
          </div>
          <div>
            <label htmlFor="sort_order" className="block text-sm font-medium">Sort Order</label>
            <input
              type="number"
              id="sort_order"
              name="sort_order"
              defaultValue={testimonial?.sort_order ?? 0}
              className="mt-1.5 block w-20 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </fieldset>

      {/* Submit */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button type="submit" loading={isPending}>
          {isEditing ? "Save Changes" : "Add Testimonial"}
        </Button>
        <Button variant="ghost" asChild>
          <a href="/admin/testimonials">Cancel</a>
        </Button>
      </div>
    </form>
  );
}
