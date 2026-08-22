import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { H2 } from "@/components/ui/typography";
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
        "group relative flex flex-col rounded-xl border border-border/70 bg-card p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-md md:p-8",
        primary && "md:col-span-2"
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
        {project.category || "Project"}
      </p>

      <h3 className={cn("mt-2 font-heading font-semibold leading-tight", primary ? "text-xl md:text-2xl" : "text-lg")}>
        {project.title}
      </h3>

      <div className="mt-4 space-y-2">
        {project.problem && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground/80">Problem:</span>{" "}
            {project.problem}
          </p>
        )}
        {project.solution && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground/80">Solution:</span>{" "}
            {project.solution}
          </p>
        )}
      </div>

      {project.technologies.length > 0 && (
        <p className="mt-4 text-[11px] text-muted-foreground/50">
          {project.technologies.join(" · ")}
        </p>
      )}

      <div className="mt-5">
        <Link
          href={`/work/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View case study
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

/* ─── Empty State ─────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border py-16 text-center">
      <p className="font-heading text-sm font-semibold text-muted-foreground/60">
        Case studies coming soon
      </p>
      <p className="mt-2 text-xs text-muted-foreground/40">
        Real project walkthroughs will appear here.
      </p>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────── */

export async function FeaturedWork() {
  const projects = await getFeaturedProjects();

  return (
    <section className="bg-surface-muted py-14 md:py-18 lg:py-20">
      <Container>
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              Proof of work
            </p>
            <H2 className="mt-2">Work I&apos;ve done</H2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Real automation and integration work. Each project started with a
              business problem, not a technology choice.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/work">
              All work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Projects */}
        <div className="mt-10">
          {projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
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
    </section>
  );
}
