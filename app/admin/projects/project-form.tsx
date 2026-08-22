"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createProject, updateProject } from "./actions";


interface ProjectData {
  id?: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  problem: string;
  solution: string;
  outcome: string;
  context: string;
  workflow: string;
  architecture: string;
  before_state: string;
  after_state: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
}

interface ProjectFormProps {
  project?: ProjectData;
}

const initialResult = { success: false, error: undefined as string | undefined };

export function ProjectForm({ project }: ProjectFormProps) {
  const isEditing = !!project?.id;

  const boundAction = isEditing
    ? updateProject.bind(null, project!.id!)
    : createProject;

  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialResult
  );

  return (
    <form action={formAction} className="space-y-8">
      {/* Error */}
      {state.error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* Success */}
      {state.success && isEditing && (
        <div className="rounded-md bg-success/10 px-4 py-3 text-sm text-success">
          Project saved successfully.
        </div>
      )}

      {/* ─── Basic Info ─────────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Project Details</legend>

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
              defaultValue={project?.title ?? ""}
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
              defaultValue={project?.slug ?? ""}
              placeholder="auto-generated-from-title"
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              URL path: /work/[slug]. Leave blank to auto-generate.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              defaultValue={project?.category ?? ""}
              placeholder="e.g., CRM · Automation"
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="technologies" className="block text-sm font-medium">
              Technologies
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              defaultValue={project?.technologies?.join(", ") ?? ""}
              placeholder="CRM, Automation, API (comma-separated)"
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
            defaultValue={project?.short_description ?? ""}
            placeholder="Brief overview for project listings"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </fieldset>

      {/* ─── Case Study ─────────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Case Study Content</legend>

        <div>
          <label htmlFor="context" className="block text-sm font-medium">
            Business Context
          </label>
          <textarea
            id="context"
            name="context"
            rows={3}
            defaultValue={project?.context ?? ""}
            placeholder="Describe the business situation and client"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="problem" className="block text-sm font-medium">
            Problem
          </label>
          <textarea
            id="problem"
            name="problem"
            rows={3}
            defaultValue={project?.problem ?? ""}
            placeholder="What wasn't working?"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="solution" className="block text-sm font-medium">
            Solution
          </label>
          <textarea
            id="solution"
            name="solution"
            rows={3}
            defaultValue={project?.solution ?? ""}
            placeholder="What was built or connected?"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="outcome" className="block text-sm font-medium">
            Outcome
          </label>
          <textarea
            id="outcome"
            name="outcome"
            rows={2}
            defaultValue={project?.outcome ?? ""}
            placeholder="What changed — measurable where possible"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="before_state" className="block text-sm font-medium">
              Before State
            </label>
            <textarea
              id="before_state"
              name="before_state"
              rows={2}
              defaultValue={project?.before_state ?? ""}
              placeholder="How it worked before"
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="after_state" className="block text-sm font-medium">
              After State
            </label>
            <textarea
              id="after_state"
              name="after_state"
              rows={2}
              defaultValue={project?.after_state ?? ""}
              placeholder="How it works now"
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div>
          <label htmlFor="workflow" className="block text-sm font-medium">
            Workflow
          </label>
          <textarea
            id="workflow"
            name="workflow"
            rows={3}
            defaultValue={project?.workflow ?? ""}
            placeholder="Step-by-step automation flow"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="architecture" className="block text-sm font-medium">
            Architecture
          </label>
          <textarea
            id="architecture"
            name="architecture"
            rows={3}
            defaultValue={project?.architecture ?? ""}
            placeholder="System architecture / connected systems"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </fieldset>

      {/* ─── Publishing ─────────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Publishing</legend>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              defaultChecked={project?.published ?? false}
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="published" className="text-sm font-medium">
              Published
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={project?.featured ?? false}
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured on homepage
            </label>
          </div>

          <div>
            <label htmlFor="sort_order" className="block text-sm font-medium">
              Sort Order
            </label>
            <input
              type="number"
              id="sort_order"
              name="sort_order"
              defaultValue={project?.sort_order ?? 0}
              className="mt-1.5 block w-20 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </fieldset>

      {/* ─── Submit ─────────────────────────────────── */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button type="submit" loading={isPending}>
          {isEditing ? "Save Changes" : "Create Project"}
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/admin/projects">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
