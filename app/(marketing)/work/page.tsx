import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H1, Body } from "@/components/ui/typography";
import { ProjectRow } from "@/components/sections/project-row";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getPublishedProjectsWithWebsite } from "@/lib/supabase/project-content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies and projects showcasing automation, integration, and systems work.",
};

export default async function WorkPage() {
  const projects = await getPublishedProjectsWithWebsite();

  return (
    <Section className="pt-20 md:pt-28">
      <Container>
        <RevealGroup className="max-w-xl">
          <RevealItem variant="heading">
            <H1>Work</H1>
          </RevealItem>
          <RevealItem variant="body">
            <Body className="mt-4 text-muted-foreground">
              Real automation and integration work. Each project started with a
              business problem, not a technology choice.
            </Body>
          </RevealItem>
        </RevealGroup>

        <div className="mt-12">
          {projects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Case studies are being documented and will appear here soon.
              </p>
            </div>
          ) : (
            projects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
                viewLabel="View case study"
              />
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}
