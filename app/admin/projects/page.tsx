import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/supabase/admin";
import { ProjectsTable } from "./projects-table";

export default async function AdminProjectsPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let error: string | null = null;

  try {
    projects = await getProjects();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load projects.";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage case studies and portfolio projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No projects yet.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create your first project to get started.
            </p>
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link href="/admin/projects/new">
                <Plus className="h-4 w-4" />
                Create Project
              </Link>
            </Button>
          </div>
        ) : (
          <ProjectsTable projects={projects} />
        )}
      </div>
    </div>
  );
}
