import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/supabase/admin";
import { ProjectForm } from "../project-form";
import { ProjectVideos } from "./project-videos";

export default async function EditProjectPage(
  props: PageProps<"/admin/projects/[id]">
) {
  const { id } = await props.params;

  let project;
  try {
    project = await getProjectById(id);
  } catch {
    notFound();
  }

  if (!project) notFound();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold">Edit: {project.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {project.published ? "Published" : "Draft"} · /work/{project.slug}
        </p>
      </div>

      <ProjectForm project={project} />

      {/* Videos section */}
      <ProjectVideos
        projectId={project.id}
        videos={project.project_videos ?? []}
      />
    </div>
  );
}
