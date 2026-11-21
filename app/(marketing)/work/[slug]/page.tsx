import { Container } from "@/components/layout/container";
import { HomepageAtmosphere } from "@/components/layout/homepage-atmosphere";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import {
  CaseLabel,
  CaseSection,
  SectionHeading,
} from "@/components/sections/case-study/editorial";
import { CaseSnapshot, snapshotRows } from "@/components/sections/case-study/snapshot";
import { CaseProblem } from "@/components/sections/case-study/problem";
import { CaseBuilt } from "@/components/sections/case-study/built";
import { CaseChanged } from "@/components/sections/case-study/changed";
import { CaseContactCta, CaseNeighbors } from "@/components/sections/case-study/close";
import { getPublishedProjects } from "@/lib/supabase/queries";
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
  const published = await getPublishedProjects();
  const here = published.findIndex((item) => item.slug === project.slug);
  const previous = here > 0 ? published[here - 1] : null;
  const following = here >= 0 && here < published.length - 1 ? published[here + 1] : null;

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
        <Container className="px-[clamp(20px,4vw,56px)] sm:px-[clamp(20px,4vw,56px)] lg:px-[clamp(20px,4vw,56px)]">
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
              <h1 className="mt-6 max-w-4xl font-sans text-[2.15rem] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
                {renderInline(project.title, "project-title")}
              </h1>
            </RevealItem>
            <RevealItem variant="body">
              <CaseSnapshot rows={snapshotRows(project)} />
            </RevealItem>
            {project.short_description && (
              <RevealItem variant="body">
                <RichText
                  content={project.short_description}
                  className="mt-7 max-w-[62ch] font-sans text-[1.0625rem] leading-[1.62] sm:text-[1.125rem] sm:leading-[1.62]"
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

        </Container>
      </section>

      {project.problem && (
        <CaseProblem context={project.context} content={project.problem} />
      )}

      {/* ─── 03 / SOLUTION — long-form editorial ─── */}
      {project.solution && (
        <CaseBuilt
          content={project.solution}
          tools={tools}
          video={
            project.video
              ? {
                  provider: project.video.provider as "youtube" | "loom",
                  video_id: project.video.video_id,
                  title: project.video.title,
                  thumbnail_url: project.video.thumbnail_url,
                }
              : null
          }
          projectName={project.title}
          projectSlug={project.slug}
        />
      )}

      {project.outcome && (
        <CaseChanged
          content={project.outcome}
          before={project.before_state}
          after={project.after_state}
        />
      )}

      {/* ─── CLIENT PROOF ─── */}
      {project.testimonial && (
        <CaseSection muted>
          <SectionHeading label="CLIENT PROOF" title="What the client said." />
          <UpworkProof
            quote={project.testimonial.quote.replaceAll("enthusistic", "enthusiastic")}
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
      <CaseNeighbors
        previous={previous ? { slug: previous.slug, title: previous.title } : null}
        next={following ? { slug: following.slug, title: following.title } : null}
      />
      <CaseContactCta />
      </HomepageAtmosphere>
    </>
  );
}
