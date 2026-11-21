import { VideoEmbed } from "@/components/media/video-embed";
import { renderInline, RichText } from "@/components/ui/rich-text";
import "./case-built.css";

type CaseVideo = {
  provider: "youtube" | "loom";
  video_id: string;
  title: string | null;
  thumbnail_url: string | null;
};

/** Solution text, the tools named on the case, and the existing walkthrough. */
export function CaseBuilt({
  content,
  tools,
  video,
  projectName,
  projectSlug,
}: {
  content: string;
  tools: string[];
  video: CaseVideo | null;
  projectName: string;
  projectSlug: string;
}) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-[clamp(20px,4vw,56px)] py-14 md:py-20">
        <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.14em] text-green-deep uppercase">
          <span className="h-px w-5 bg-primary" aria-hidden="true" />
          What I built
        </p>
        <h2 className="mt-4 max-w-3xl font-sans text-[1.75rem] leading-[1.12] font-semibold tracking-[-0.035em] text-foreground sm:text-[2.25rem]">
          The system around the work.
        </h2>

        {tools.length > 0 && (
          <div
            className="mt-10 border border-foreground/15 bg-white p-4 sm:p-6"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(16 24 40 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(16 24 40 / 0.06) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          >
            <p className="font-mono text-[10px] tracking-[0.14em] text-ink-faint uppercase">
              Fig. Tools in this system
            </p>
            <div className="case-wire mt-4 h-px w-full bg-primary" aria-hidden="true" />
            <ul className="mt-4 flex flex-wrap gap-3">
              {tools.map((tool, index) => (
                <li
                  key={`${tool}-${index}`}
                  className="flex min-h-16 min-w-[7.5rem] items-center justify-center border border-foreground bg-white px-3 py-3 text-center font-mono text-[11px] leading-snug tracking-wide text-foreground"
                >
                  {renderInline(tool, `built-tool-${index}`)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <RichText
          content={content}
          className="mt-8 max-w-3xl text-base leading-7 text-muted-foreground sm:text-[17px] sm:leading-8"
        />

        {video && (
          <div className="mt-10 max-w-4xl">
            <VideoEmbed
              provider={video.provider}
              videoId={video.video_id}
              title={video.title || projectName}
              thumbnail={video.thumbnail_url ?? undefined}
              projectName={projectName}
              projectSlug={projectSlug}
            />
          </div>
        )}
      </div>
    </section>
  );
}
