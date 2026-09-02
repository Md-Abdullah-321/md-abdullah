import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getFeaturedProjectsWithWebsite } from "@/lib/supabase/project-content";
import { ArrowRight } from "lucide-react";
import { TrackLink } from "@/components/analytics/track-link";
import { ProjectRow } from "./project-row";

export async function FeaturedWork() {
  const projects = await getFeaturedProjectsWithWebsite();
  return (
    <section
      className="relative isolate overflow-hidden bg-surface-muted py-14 md:py-20"
      id="featured-work"
    >
      <div className="pointer-events-none absolute -right-64 top-24 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/45 blur-3xl" />
      <Container>
        <RevealGroup className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <RevealItem variant="label">
              <p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-primary">
                PROOF OF WORK
              </p>
            </RevealItem>
            <RevealItem variant="heading">
              <H2 className="mt-3">Work I&apos;ve done</H2>
            </RevealItem>
            <RevealItem variant="body">
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Real systems, real workflows, and the selected project video
                behind the case study.
              </p>
            </RevealItem>
          </div>
          <RevealItem variant="body">
            <Button variant="ghost" size="sm" asChild>
              <TrackLink
                href="/work"
                event={{ event: "cta_click", cta_name: "all_work", location: "featured_work" }}
              >
                All work <ArrowRight className="h-4 w-4" />
              </TrackLink>
            </Button>
          </RevealItem>
        </RevealGroup>
        <div className="mt-10">
          {projects.length === 0 ? (
            <div className="border-y border-dashed border-border py-16 text-center">
              <p className="font-mono text-sm text-muted-foreground/60">
                Case studies coming soon
              </p>
            </div>
          ) : (
            projects.map((project, index) => (
              <ProjectRow key={project.id} project={project} index={index} />
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
