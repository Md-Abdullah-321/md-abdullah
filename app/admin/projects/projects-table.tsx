"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Eye, Trash2, Globe, GlobeLock } from "lucide-react";
import { cn } from "@/lib/utils";
import { publishProject, unpublishProject, deleteProject } from "./actions";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  featured: boolean;
  sort_order: number;
  updated_at: string;
}

export function ProjectsTable({ projects }: { projects: Project[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Title</th>
            <th className="px-4 py-3 text-left font-medium">Category</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Featured</th>
            <th className="px-4 py-3 text-left font-medium">Updated</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const [isPending, startTransition] = useTransition();

  function handlePublishToggle() {
    startTransition(async () => {
      if (project.published) {
        await unpublishProject(project.id);
      } else {
        await publishProject(project.id);
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteProject(project.id);
    });
  }

  return (
    <tr
      className={cn(
        "border-b border-border transition-opacity",
        isPending && "opacity-50"
      )}
    >
      <td className="px-4 py-3 font-medium">{project.title}</td>
      <td className="px-4 py-3 text-muted-foreground">
        {project.category || "—"}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            project.published
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          )}
        >
          {project.published ? (
            <>
              <Globe className="h-3 w-3" /> Published
            </>
          ) : (
            <>
              <GlobeLock className="h-3 w-3" /> Draft
            </>
          )}
        </span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {project.featured ? "Yes" : "—"}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {new Date(project.updated_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/projects/${project.id}`}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          {project.published && (
            <Link
              href={`/work/${project.slug}`}
              target="_blank"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              title="View public"
            >
              <Eye className="h-4 w-4" />
            </Link>
          )}
          <button
            onClick={handlePublishToggle}
            disabled={isPending}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title={project.published ? "Unpublish" : "Publish"}
          >
            {project.published ? (
              <GlobeLock className="h-4 w-4" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
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
