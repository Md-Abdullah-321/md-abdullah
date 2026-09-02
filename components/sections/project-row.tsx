import { VideoEmbed } from "@/components/media/video-embed";
import { renderInline, RichText } from "@/components/ui/rich-text";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { TrackLink } from "@/components/analytics/track-link";

/* ─── ProjectRow ──────────────────────────────────────
 * The homepage project presentation — one editorial row
 * per project: video on the left, summary on the right.
 * Shared by the homepage "Work I've done" section and
 * the /work project index, so both stay in the same
 * visual language.
 */

export type ProjectRowData = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  problem?: string | null;
  solution?: string | null;
  category: string;
  technologies: string[] | null;
  website_url?: string | null;
  website_label?: string | null;
  video?: {
    title?: string | null;
    provider: string;
    video_id: string;
    thumbnail_url: string | null;
  } | null;
};

export function ProjectRow({
  project,
  index,
  viewLabel = "View project",
}: {
  project: ProjectRowData;
  index: number;
  viewLabel?: string;
}) {
  const technologies = project.technologies ?? [];

  return (
    <article className="grid gap-8 border-t border-border/80 py-10 md:grid-cols-[1.35fr_0.85fr] md:items-center md:gap-12 md:py-14">
      {project.video && (
        <Reveal variant="media">
          <VideoEmbed
            provider={project.video.provider as "youtube" | "loom"}
            videoId={project.video.video_id}
            title={project.video.title || project.title}
            thumbnail={project.video.thumbnail_url ?? undefined}
            projectName={project.title}
            projectSlug={project.slug}
          />
        </Reveal>
      )}
      <RevealGroup className={cn(!project.video && "md:col-span-2 md:max-w-2xl")}>
        <RevealItem variant="label">
          <p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-primary">
            {String(index + 1).padStart(2, "0")} /{" "}
            {renderInline(project.category || "PROJECT", `category-${project.id}`)}
          </p>
        </RevealItem>
        <RevealItem variant="heading">
          <h3 className="mt-4 font-mono text-2xl font-semibold leading-tight tracking-[-0.05em] sm:text-3xl">
            {renderInline(project.title, `title-${project.id}`)}
          </h3>
        </RevealItem>
        {(project.short_description || project.solution || project.problem) && (
          <RevealItem variant="body">
            <RichText
              variant="card"
              content={
                project.short_description || project.solution || project.problem || ""
              }
              className="mt-5"
            />
          </RevealItem>
        )}
        {technologies.length > 0 && (
          <RevealItem variant="body">
            <p className="mt-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
              {technologies.map((tech, techIndex) => (
                <span key={tech}>
                  {techIndex > 0 && " · "}
                  {renderInline(tech, `tech-${project.id}-${techIndex}`)}
                </span>
              ))}
            </p>
          </RevealItem>
        )}
        <RevealItem variant="body">
          <div className="mt-7 flex flex-wrap gap-5">
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary"
            >
              {viewLabel} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {project.website_url && (
              <TrackLink
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                event={{
                  event: "project_website_click",
                  project_name: project.title,
                  project_slug: project.slug,
                  project_category: project.category || undefined,
                }}
              >
                {renderInline(
                  project.website_label || "Visit Website",
                  `website-${project.id}`
                )}{" "}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </TrackLink>
            )}
          </div>
        </RevealItem>
      </RevealGroup>
    </article>
  );
}
