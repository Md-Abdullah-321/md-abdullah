import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { H2 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { VideoEmbed } from "@/components/media/video-embed";
import { getFeaturedProjectsWithWebsite } from "@/lib/supabase/project-content";

type Project = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  problem: string;
  solution: string;
  category: string;
  technologies: string[];
  website_url: string | null;
  website_label?: string | null;
  video?: { title: string; provider: string; video_id: string; thumbnail_url: string | null } | null;
};

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <article className="grid gap-8 border-t border-border/80 py-10 md:grid-cols-[1.35fr_0.85fr] md:items-center md:gap-12 md:py-14">
      {project.video && <VideoEmbed provider={project.video.provider as "youtube" | "loom"} videoId={project.video.video_id} title={project.video.title || project.title} thumbnail={project.video.thumbnail_url ?? undefined} />}
      <div>
        <p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-primary">{String(index + 1).padStart(2, "0")} / {project.category || "PROJECT"}</p>
        <h3 className="mt-4 font-mono text-2xl font-semibold leading-tight tracking-[-0.05em] sm:text-3xl">{project.title}</h3>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">{project.short_description || project.solution || project.problem}</p>
        {project.technologies.length > 0 && <p className="mt-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">{project.technologies.join(" · ")}</p>}
        <div className="mt-7 flex flex-wrap gap-5">
          <Link href={`/work/${project.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary">View project <ArrowRight className="h-3.5 w-3.5" /></Link>
          {project.website_url && <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">{project.website_label || "Visit Website"} <ArrowUpRight className="h-3.5 w-3.5" /></a>}
        </div>
      </div>
    </article>
  );
}

export async function FeaturedWork() {
  const projects = await getFeaturedProjectsWithWebsite();
  return <section className="relative isolate overflow-hidden bg-surface-muted py-14 md:py-20"><div className="pointer-events-none absolute -right-64 top-24 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/45 blur-3xl" /><Container><div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-primary">PROOF OF WORK</p><H2 className="mt-3">Work I&apos;ve done</H2><p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">Real systems, real workflows, and the selected project video behind the case study.</p></div><Button variant="ghost" size="sm" asChild><Link href="/work">All work <ArrowRight className="h-4 w-4" /></Link></Button></div><div className="mt-10">{projects.length === 0 ? <div className="border-y border-dashed border-border py-16 text-center"><p className="font-mono text-sm text-muted-foreground/60">Case studies coming soon</p></div> : projects.map((project, index) => <ProjectRow key={project.id} project={project} index={index} />)}</div></Container></section>;
}
