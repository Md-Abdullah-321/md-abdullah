import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H1, H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { VideoEmbed } from "@/components/media/video-embed";
import { getProjectBySlug } from "@/lib/supabase/queries";

export async function generateMetadata(
  props: PageProps<"/work/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: "Not Found" };

  const description = project.short_description || project.problem || "";

  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "article",
      url: `/work/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
    },
  };
}

export default async function CaseStudyPage(
  props: PageProps<"/work/[slug]">
) {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const videos = project.project_videos ?? [];

  return (
    <Section className="pt-20 md:pt-28">
      <Container narrow>
        {/* Header */}
        <header>
          {project.category && (
            <p className="text-sm font-medium text-muted-foreground">
              {project.category}
            </p>
          )}
          <H1 className="mt-2">{project.title}</H1>
          {project.short_description && (
            <Body className="mt-4 text-muted-foreground">
              {project.short_description}
            </Body>
          )}
        </header>

        {/* Case study content */}
        <div className="mt-12 space-y-10">
          {project.context && (
            <div>
              <H2 className="text-xl">Context</H2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {project.context}
              </p>
            </div>
          )}

          {project.problem && (
            <div>
              <H2 className="text-xl">Problem</H2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {project.problem}
              </p>
            </div>
          )}

          {(project.before_state || project.after_state) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {project.before_state && (
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Before
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">
                    {project.before_state}
                  </p>
                </div>
              )}
              {project.after_state && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">
                    After
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">
                    {project.after_state}
                  </p>
                </div>
              )}
            </div>
          )}

          {project.solution && (
            <div>
              <H2 className="text-xl">Solution</H2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {project.solution}
              </p>
            </div>
          )}

          {project.workflow && (
            <div>
              <H2 className="text-xl">Workflow</H2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {project.workflow}
              </p>
            </div>
          )}

          {project.architecture && (
            <div>
              <H2 className="text-xl">Architecture</H2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {project.architecture}
              </p>
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div className="space-y-4">
              <H2 className="text-xl">Walkthrough</H2>
              {videos.map((video: { id: string; provider: string; video_id: string; title: string }) => (
                <VideoEmbed
                  key={video.id}
                  provider={video.provider as "youtube" | "loom"}
                  videoId={video.video_id}
                  title={video.title}
                />
              ))}
            </div>
          )}

          {project.outcome && (
            <div>
              <H2 className="text-xl">Outcome</H2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {project.outcome}
              </p>
            </div>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Technologies
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="rounded-sm bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-lg font-semibold">Have a similar problem?</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell me what&apos;s happening and we can figure out what makes sense for your business.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/contact">
              Start a Conversation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
