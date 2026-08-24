import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { VideoEmbed } from "@/components/media/video-embed";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { Body } from "@/components/ui/typography";
import { getProjectBySlugWithRelations } from "@/lib/supabase/project-relations";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProjectBySlugWithRelations(slug);
  if (!project) return { title: "Not Found" };
  return {
    title: project.title,
    description: project.short_description || project.problem || "",
  };
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-primary">
      {children}
    </p>
  );
}
function Story({
  number,
  label,
  title,
  content,
  className = "",
}: {
  number: string;
  label: string;
  title: string;
  content?: string | null;
  className?: string;
}) {
  if (!content) return null;
  return (
    <section
      className={`border-t border-border/80 py-14 md:py-20 ${className}`}
    >
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <Label>
              {number} / {label}
            </Label>
            <h2 className="mt-4 max-w-sm font-mono text-3xl font-semibold leading-tight tracking-[-0.06em] sm:text-5xl">
              {title}
            </h2>
          </div>
          <RichText content={content} />
        </div>
      </Container>
    </section>
  );
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = await getProjectBySlugWithRelations(slug);
  if (!project) notFound();
  return (
    <main className="relative isolate overflow-hidden bg-background">
      <div className="pointer-events-none absolute -right-72 top-0 -z-10 h-[42rem] w-[42rem] rounded-full bg-accent/45 blur-3xl" />
      <Section className="pt-14 md:pt-24 lg:pt-32">
        <Container>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> BACK TO WORK
          </Link>
          <header className="mt-14 max-w-5xl">
            <div className="flex flex-wrap items-center gap-4">
              <Label>CASE STUDY</Label>
              {project.category && (
                <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
                  {project.category}
                </span>
              )}
            </div>
            <h1 className="mt-6 font-mono text-4xl font-semibold leading-[1.02] tracking-[-0.07em] sm:text-6xl lg:text-8xl">
              {project.title}
            </h1>
            {project.short_description && (
              <Body className="mt-8 max-w-2xl text-lg sm:text-xl">
                {project.short_description}
              </Body>
            )}
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.08em] text-primary"
              >
                {project.website_label || "Visit Website"}{" "}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </header>
        </Container>
      </Section>
      <Story
        number="01"
        label="CONTEXT"
        title="The situation"
        content={project.context}
        className="bg-surface-muted/45"
      />
      <Story
        number="02"
        label="PROBLEM"
        title="Where the work got stuck"
        content={project.problem}
        className="bg-warning/[0.045]"
      />
      {(project.before_state || project.after_state) && (
        <section className="border-y border-border/80">
          <Container>
            <div className="py-14 md:py-20">
              <Label>THE SHIFT</Label>
              <h2 className="mt-4 font-mono text-3xl font-semibold tracking-[-0.06em] sm:text-6xl">
                From friction to flow.
              </h2>
              <div className="mt-10 grid gap-0 overflow-hidden rounded-[var(--radius-lg)] border border-border/80 md:grid-cols-2">
                <div className="bg-warning/[0.04] p-7 md:p-10">
                  <p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-warning">
                    BEFORE / THE FRICTION
                  </p>
                  {project.before_state && (
                    <RichText className="mt-6" content={project.before_state} />
                  )}
                </div>
                <div className="bg-accent/35 p-7 md:p-10">
                  <p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-primary">
                    AFTER / THE SYSTEM
                  </p>
                  {project.after_state && (
                    <RichText className="mt-6" content={project.after_state} />
                  )}
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}
      <Story
        number="03"
        label="SOLUTION"
        title="What I built"
        content={project.solution}
        className="bg-accent/25"
      />
      <Story
        number="04"
        label="WORKFLOW"
        title="How it works"
        content={project.workflow}
      />
      <Story
        number="05"
        label="ARCHITECTURE"
        title="The system behind it"
        content={project.architecture}
      />
      {project.video && (
        <section className="border-t border-border/80 bg-surface-muted/45">
          <Container>
            <div className="py-14 md:py-20">
              <Label>PROJECT VIDEO</Label>
              <h2 className="mt-4 font-mono text-3xl font-semibold tracking-[-0.06em] sm:text-6xl">
                See the work in motion.
              </h2>
              <div className="mt-10">
                <VideoEmbed
                  provider={project.video.provider as "youtube" | "loom"}
                  videoId={project.video.video_id}
                  title={project.video.title}
                  thumbnail={project.video.thumbnail_url ?? undefined}
                />
              </div>
            </div>
          </Container>
        </section>
      )}
      {project.testimonial && (
        <section className="border-t border-border/80">
          <Container>
            <div className="grid gap-10 py-14 md:grid-cols-2 md:gap-14 md:py-20">
              <div>
                <Label>CLIENT PROOF</Label>
                <h2 className="mt-4 font-mono text-3xl font-semibold tracking-[-0.06em] sm:text-5xl">
                  What the client said.
                </h2>
              </div>
              <blockquote className="border-l-2 border-primary/40 pl-6 text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
                &quot;{project.testimonial.quote}&quot;
                <footer className="mt-6 font-mono text-xs tracking-[0.1em] text-foreground">
                  {project.testimonial.client_name}
                  {project.testimonial.company
                    ? ` · ${project.testimonial.company}`
                    : ""}
                </footer>
              </blockquote>
            </div>
          </Container>
        </section>
      )}
      <Story
        number="06"
        label="OUTCOME"
        title="What changed"
        content={project.outcome}
      />
      {project.technologies?.length > 0 && (
        <section className="border-t border-border/80">
          <Container>
            <div className="flex flex-col gap-5 py-10 sm:flex-row sm:items-baseline sm:justify-between">
              <Label>TOOLS IN THE SYSTEM</Label>
              <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs text-muted-foreground">
                {project.technologies.map((tech: string) => (
                  <span className="flex items-center gap-2" key={tech}>
                    <Check className="h-3 w-3 text-primary" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
      <Section className="border-t border-border/70 bg-surface-muted/45">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <Label>NEXT STEP</Label>
              <h2 className="mt-4 font-mono text-3xl font-semibold tracking-[-0.06em] sm:text-5xl">
                Have a similar problem?
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                Tell me what is happening and we can figure out what makes sense
                for your business.
              </p>
            </div>
            <Button asChild>
              <Link href="/contact">
                Start a conversation <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
