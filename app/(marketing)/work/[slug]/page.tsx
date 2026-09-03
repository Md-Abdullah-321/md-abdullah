import { Container } from "@/components/layout/container";
import { HomepageAtmosphere } from "@/components/layout/homepage-atmosphere";
import { VideoEmbed } from "@/components/media/video-embed";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import {
  CaseLabel,
  CaseSection,
  SectionHeading,
  StorySplit,
  StoryWide,
} from "@/components/sections/case-study/editorial";
import {
  ArchitectureFlow,
  WorkflowSteps,
} from "@/components/sections/case-study/sequences";
import { TheShift } from "@/components/sections/case-study/the-shift";
import { FinalCTA } from "@/components/sections/final-cta";
import { UpworkProof } from "@/components/sections/upworkproof";
import { renderInline, RichText, stripInlineMarkdown } from "@/components/ui/rich-text";
import { getProjectBySlugWithRelations } from "@/lib/supabase/project-relations";
import { generateProjectJsonLd, JsonLd } from "@/lib/seo/structured-data";
import { SITE_URL } from "@/lib/constants";
import { ProjectViewTracker } from "@/components/analytics/project-view-tracker";
import { TrackLink } from "@/components/analytics/track-link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProjectBySlugWithRelations(slug);
  if (!project) return { title: "Not Found" };
  const description = stripInlineMarkdown(
    project.short_description || project.problem || "",
  );
  const canonicalUrl = `${SITE_URL}/work/${project.slug}`;
  return {
    title: {
      // Renders as "<title> | Work | Md Abdullah" via the layout template.
      absolute: `${project.title} | Work`,
    },
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} | Work | Md Abdullah`,
      description,
      url: canonicalUrl,
      type: "article",
    },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = await getProjectBySlugWithRelations(slug);
  if (!project) notFound();

  const tools = (project.technologies ?? []).flatMap((tech: string) =>
    tech
      .split("·")
      .map((tool) => tool.trim())
      .filter(Boolean),
  );

  return (
    <>
      <JsonLd
        data={generateProjectJsonLd({
          title: project.title,
          slug: project.slug,
          description: stripInlineMarkdown(
            project.short_description || project.problem || "",
          ),
          authorName: "Md Abdullah",
          authorUrl: SITE_URL,
        })}
      />
      <ProjectViewTracker slug={project.slug} name={project.title} category={project.category} />
      <HomepageAtmosphere>
        {/* ─── Intro + project video ─── */}
      <section className="pt-12 md:pt-20 lg:pt-24">
        <Container>
          <Reveal variant="body" inView={false} delay={0}>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> BACK TO WORK
            </Link>
          </Reveal>

          <RevealGroup as="header" className="mt-12 sm:mt-14" inView={false} stagger={0.08}>
            <RevealItem variant="label">
              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-primary" aria-hidden="true" />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.09em] text-foreground/90 sm:text-[12px]">
                    CASE STUDY
                  </span>
                </div>
                {project.category && (
                  <CaseLabel>{renderInline(project.category, "project-category")}</CaseLabel>
                )}
              </div>
            </RevealItem>
            <RevealItem variant="heading">
              <h1 className="mt-6 max-w-4xl font-mono text-[2.6rem] font-semibold leading-[0.96] tracking-[-0.035em] text-foreground text-balance sm:text-[3.4rem] lg:text-[4.5rem]">
                {renderInline(project.title, "project-title")}
              </h1>
            </RevealItem>
            {project.short_description && (
              <RevealItem variant="body">
                <RichText
                  content={project.short_description}
                  className="mt-7 max-w-[50ch] font-sans text-[1.0625rem] leading-[1.62] sm:text-[1.125rem] sm:leading-[1.62]"
                />
              </RevealItem>
            )}
            {project.website_url && (
              <RevealItem variant="body">
                <TrackLink
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary"
                  event={{
                    event: "project_website_click",
                    project_name: project.title,
                    project_slug: project.slug,
                    project_category: project.category || undefined,
                  }}
                >
                  {renderInline(
                    project.website_label || "Visit Website",
                    "website-label"
                  )}{" "}
                  <ArrowUpRight className="h-4 w-4" />
                </TrackLink>
              </RevealItem>
            )}
          </RevealGroup>

          {project.video && (
            <Reveal variant="media" inView={false} delay={0.3} className="mt-12 md:mt-16">
              <VideoEmbed
                provider={project.video.provider as "youtube" | "loom"}
                videoId={project.video.video_id}
                title={project.video.title}
                thumbnail={project.video.thumbnail_url ?? undefined}
                projectName={project.title}
                projectSlug={project.slug}
              />
            </Reveal>
          )}
        </Container>
      </section>

      {/* ─── 01 / CONTEXT ─── */}
      {project.context && (
        <StorySplit
          narrow
          label="01 / CONTEXT"
          title="The situation"
          content={project.context}
        />
      )}

      {/* ─── 02 / PROBLEM — feels like "Common patterns" ─── */}
      {project.problem && (
        <StorySplit
          muted
          narrow
          label="02 / PROBLEM"
          title="Where the work got stuck"
          content={project.problem}
        />
      )}

      {/* ─── THE SHIFT ─── */}
      {(project.before_state || project.after_state) && (
        <TheShift before={project.before_state} after={project.after_state} />
      )}

      {/* ─── 03 / SOLUTION — long-form editorial ─── */}
      {project.solution && (
        <StoryWide
          muted
          label="03 / SOLUTION"
          title="What I built"
          content={project.solution}
        />
      )}

      {/* ─── 04 / WORKFLOW ─── */}
      {project.workflow && <WorkflowSteps content={project.workflow} />}

      {/* ─── 05 / ARCHITECTURE ─── */}
      {project.architecture && (
        <ArchitectureFlow content={project.architecture} />
      )}

      {/* ─── 06 / OUTCOME ─── */}
      {project.outcome && (
        <StorySplit
          narrow
          label="06 / OUTCOME"
          title="What changed"
          content={project.outcome}
          footer={
            <div className="border-y border-border/70 py-4 font-mono text-[11px] uppercase tracking-[0.13em]">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="text-muted-foreground/65">Manual tracking</span>
                <span className="text-border">→</span>
                <span className="text-foreground/70">One CRM workflow</span>
                <span className="text-border">→</span>
                <span className="text-primary/80">Connected</span>
                <span className="text-border">→</span>
                <span className="font-semibold text-primary">Automated</span>
              </div>
            </div>
          }
        />
      )}

      {/* ─── TOOLS IN THE SYSTEM ─── */}
      {tools.length > 0 && (
        <CaseSection compact>
          <Reveal variant="body" className="flex flex-col gap-6 sm:flex-row sm:items-baseline sm:gap-x-8">
            <CaseLabel className="shrink-0">TOOLS IN THE SYSTEM</CaseLabel>
            <span
              className="hidden h-px flex-1 bg-border/80 sm:block"
              aria-hidden="true"
            />
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
              {tools.map((tech: string, techIndex: number) => (
                <span key={tech}>
                  {renderInline(tech, `tool-${techIndex}`)}
                </span>
              ))}
            </div>
          </Reveal>
        </CaseSection>
      )}

      {/* ─── CLIENT PROOF ─── */}
      {project.testimonial && (
        <CaseSection muted>
          <SectionHeading label="CLIENT PROOF" title="What the client said." />
          <UpworkProof
            quote={project.testimonial.quote}
            highlight={project.testimonial.highlight_text ?? null}
            attribution={`${project.testimonial.client_name}${
              project.testimonial.company
                ? ` · ${project.testimonial.company}`
                : ""
            }`}
            className="mt-10 w-full"
            quoteClassName="max-w-none"
          />
        </CaseSection>
      )}

      {/* ─── NEXT STEP — the homepage CTA, project-specific copy ─── */}
      <FinalCTA
        label="Next step"
        heading="Have a similar problem?"
        body="Tell me what is happening and we can figure out what makes sense for your business."
        primaryLabel="Start a Conversation"
        primaryHref="/contact"
        secondaryLabel="Back to all work"
        secondaryHref="/work"
        reassurance="No commitment. No pressure. Just a conversation about your process."
      />
      </HomepageAtmosphere>
    </>
  );
}
