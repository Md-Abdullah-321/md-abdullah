"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export type HomeWorkItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  client: string | null;
  tools: string[];
  index: number;
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function WorkList({ projects }: { projects: HomeWorkItem[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const spine = spineRef.current;
    if (!list || !spine) return;
    const rows = [...list.querySelectorAll<HTMLElement>("[data-work-row]")];

    const update = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const rect = list.getBoundingClientRect();
      const amount = reduced ? 1 : clamp((window.innerHeight * 0.6 - rect.top) / rect.height);
      spine.style.setProperty("--s", amount.toFixed(3));
      rows.forEach((row) => {
        const rowRect = row.getBoundingClientRect();
        row.classList.toggle("is-lit", reduced || rowRect.top + 30 < window.innerHeight * 0.6);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [projects.length]);

  return (
    <div ref={listRef} className="relative">
      <div className="hl-spine" aria-hidden="true">
        <i ref={spineRef} />
      </div>
      {projects.map((project) => (
        <article
          key={project.id}
          data-work-row
          className="hl-work-row group grid grid-cols-[22px_minmax(0,1fr)] gap-x-4 border-b border-border py-7 transition-colors first:border-t hover:bg-primary/[0.035] lg:grid-cols-[64px_72px_minmax(0,1fr)_230px] lg:gap-x-7 lg:py-[38px]"
        >
          <span className="hl-joint relative z-[1] mt-2 h-[11px] w-[11px] justify-self-center rounded-full border-[1.5px] border-ink-faint bg-background" />
          <span className="hidden pt-0.5 font-mono text-[13px] text-ink-faint lg:block">
            {String(project.index).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <p className="mb-2.5 font-mono text-[11px] tracking-[0.12em] text-green-deep uppercase">
              {project.category}
              {project.client ? <span className="text-ink-faint"> · {project.client}</span> : null}
            </p>
            <h3 className="max-w-[640px] font-sans text-[21px] leading-[1.22] font-semibold tracking-[-0.025em] text-foreground transition-colors group-hover:text-green-deep lg:text-[25px]">
              <Link href={`/work/${project.slug}`} className="group-hover:text-green-deep">
                {project.title}
              </Link>
            </h3>
            {project.summary ? (
              <p className="mt-2.5 line-clamp-3 max-w-[640px] text-base text-muted-foreground">
                {project.summary}
              </p>
            ) : null}
            {project.tools.length > 0 ? (
              <p className="mt-4 font-mono text-[11.5px] tracking-wide text-muted-foreground">
                {project.tools.map((tool, toolIndex) => (
                  <span key={`${project.id}-${tool}`}>
                    {toolIndex > 0 ? <span className="mx-0.5 text-border"> / </span> : null}
                    {tool}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
          <div className="col-start-2 mt-[18px] flex flex-col items-start gap-4 lg:col-auto lg:mt-1">
            <p className="w-full rounded-[4px] border border-dashed border-border px-2.5 py-2 font-mono text-[11px] leading-normal text-ink-faint">
              <b className="block text-[10px] font-semibold tracking-[0.12em] text-muted-foreground">
                RESULT
              </b>
              add real number
            </p>
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex gap-2 border-b border-border pb-0.5 font-mono text-[13px] text-foreground transition-colors hover:border-primary hover:text-green-deep"
            >
              Case study <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
