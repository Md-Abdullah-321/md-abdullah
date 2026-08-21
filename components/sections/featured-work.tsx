import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getFeaturedProjects } from "@/lib/supabase/queries";

/* ─── Types ───────────────────────────────────────────── */

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  problem: string;
  solution: string;
  category: string;
  technologies: string[];
}

/* ─── Project Card ────────────────────────────────────── */

function ProjectCard({
  project,
  primary,
}: {
  project: ProjectItem;
  primary?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xs transition-shadow hover:shadow-md",
        primary && "md:col-span-2 md:flex-row"
      )}
    >
      {/* Media area */}
      <div
        className={cn(
          "relative bg-muted",
          primary ? "aspect-video md:aspect-auto md:w-1/2" : "aspect-video"
        )}
      >
        <div className="flex h-full items-center justify-center">
          <span className="text-xs text-muted-foreground">
            [Project visual]
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex flex-1 flex-col p-5 sm:p-6",
          primary && "md:justify-center md:p-8"
        )}
      >
        <p className="text-xs font-medium text-muted-foreground">
          {project.category || "Project"}
        </p>

        <h3
          className={cn(
            "mt-2 font-semibold leading-tight",
            primary ? "text-xl sm:text-2xl" : "text-lg"
          )}
        >
          {project.title}
        </h3>

        <div className="mt-3 space-y-2">
          {project.problem && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Problem:</span>{" "}
              {project.problem}
            </p>
          )}
          {project.solution && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Solution:</span>{" "}
              {project.solution}
            </p>
          )}
        </div>

        {project.technologies.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            {project.technologies.join(" · ")}
          </p>
        )}

        <div className="mt-4">
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View case study
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ─── Empty State ─────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-muted p-12 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        Case studies are being documented.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Projects will appear here once content is finalized.
      </p>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────── */

export async function FeaturedWork() {
  const projects = await getFeaturedProjects();

  return (
    <Section className="bg-surface-muted">
      <Container>
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              Proof of work
            </p>
            <H2 className="mt-2">Systems I&apos;ve built</H2>
            <Body className="mt-2 text-muted-foreground">
              Real automation and integration projects — each one started with a
              business problem, not a technology decision.
            </Body>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/work">
              All work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Project grid */}
        <div className="mt-10">
          {projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  primary={index === 0}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
