import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New Project</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Create a new case study or portfolio project.
      </p>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}
