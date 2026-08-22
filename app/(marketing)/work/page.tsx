import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H1, Body } from "@/components/ui/typography";
import { getPublishedProjects } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies and projects showcasing automation, integration, and systems work.",
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return (
    <Section className="pt-20 md:pt-28">
      <Container>
        <div className="max-w-xl">
          <H1>Work</H1>
          <Body className="mt-4 text-muted-foreground">
            Real automation and integration work. Each project started with a
            business problem, not a technology choice.
          </Body>
        </div>

        <div className="mt-12">
          {projects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Case studies are being documented and will appear here soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group flex flex-col rounded-lg border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md"
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    {project.category || "Project"}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">
                    {project.title}
                  </h2>
                  {project.short_description && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {project.short_description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
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
                </article>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
