"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { createProofItem, updateProofItem } from "./actions";

interface ProofData {
  id?: string;
  type: string;
  title: string;
  description: string;
  url: string | null;
  image_url: string | null;
  video_provider: string | null;
  video_id: string | null;
  project_id: string | null;
  published: boolean;
  sort_order: number;
}

interface Project {
  id: string;
  title: string;
}

const initialResult = { success: false, error: undefined as string | undefined };

const PROOF_TYPES = [
  { value: "project", label: "Project" },
  { value: "video", label: "Video" },
  { value: "testimonial", label: "Testimonial" },
  { value: "professional", label: "Professional" },
  { value: "other", label: "External" },
];

export function ProofForm({
  proof,
  projects,
}: {
  proof?: ProofData;
  projects: Project[];
}) {
  const isEditing = !!proof?.id;
  const boundAction = isEditing
    ? updateProofItem.bind(null, proof!.id!)
    : createProofItem;

  const [state, formAction, isPending] = useActionState(boundAction, initialResult);
  const [proofType, setProofType] = useState(proof?.type ?? "project");

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      {state.success && isEditing && (
        <div className="rounded-md bg-success/10 px-4 py-3 text-sm text-success">
          Proof item saved successfully.
        </div>
      )}

      {/* Details */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Proof Details</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="type" className="block text-sm font-medium">
              Type <span className="text-destructive">*</span>
            </label>
            <select
              id="type"
              name="type"
              required
              value={proofType}
              onChange={(e) => setProofType(e.target.value)}
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {PROOF_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={proof?.title ?? ""}
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={proof?.description ?? ""}
            placeholder="Brief explanation of this evidence"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </fieldset>

      {/* Conditional: Project relationship */}
      {(proofType === "project" || proofType === "testimonial") && (
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Related Project</legend>
          <div>
            <label htmlFor="project_id" className="block text-sm font-medium">
              Project <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <select
              id="project_id"
              name="project_id"
              defaultValue={proof?.project_id ?? ""}
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        </fieldset>
      )}

      {/* Conditional: Video */}
      {proofType === "video" && (
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Video</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="video_provider" className="block text-sm font-medium">
                Provider <span className="text-destructive">*</span>
              </label>
              <select
                id="video_provider"
                name="video_provider"
                defaultValue={proof?.video_provider ?? "youtube"}
                className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="youtube">YouTube</option>
                <option value="loom">Loom</option>
              </select>
            </div>
            <div>
              <label htmlFor="video_id" className="block text-sm font-medium">
                Video ID <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="video_id"
                name="video_id"
                defaultValue={proof?.video_id ?? ""}
                placeholder="Video ID or URL"
                className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </fieldset>
      )}

      {/* Conditional: External / Professional link */}
      {(proofType === "professional" || proofType === "other") && (
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">External Link</legend>
          <div>
            <label htmlFor="url" className="block text-sm font-medium">
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              defaultValue={proof?.url ?? ""}
              placeholder="https://..."
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </fieldset>
      )}

      {/* Image (all types) */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Media</legend>
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium">
            Image URL <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            defaultValue={proof?.image_url ?? ""}
            placeholder="https://..."
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </fieldset>

      {/* Hidden fields for non-applicable types */}
      {proofType !== "video" && (
        <>
          <input type="hidden" name="video_provider" value="" />
          <input type="hidden" name="video_id" value="" />
        </>
      )}
      {proofType !== "project" && proofType !== "testimonial" && (
        <input type="hidden" name="project_id" value="" />
      )}
      {proofType !== "professional" && proofType !== "other" && (
        <input type="hidden" name="url" value={proof?.url ?? ""} />
      )}

      {/* Publishing */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Publishing</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              defaultChecked={proof?.published ?? false}
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
              defaultValue={proof?.sort_order ?? 0}
              className="mt-1.5 block w-20 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </fieldset>

      {/* Submit */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button type="submit" loading={isPending}>
          {isEditing ? "Save Changes" : "Create Proof Item"}
        </Button>
        <Button variant="ghost" asChild>
          <a href="/admin/proof">Cancel</a>
        </Button>
      </div>
    </form>
  );
}
