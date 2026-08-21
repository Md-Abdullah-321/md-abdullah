import Link from "next/link";
import { ArrowRight, ExternalLink, Quote } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { getPublishedTestimonials, getPublishedProof } from "@/lib/supabase/queries";
import { VideoEmbed } from "@/components/media/video-embed";

/* ─── Testimonial Card ────────────────────────────────── */

function TestimonialCard({ testimonial }: { testimonial: { id: string; client_name: string; client_role: string; company: string; quote: string; project_id: string | null } }) {
  return (
    <blockquote className="flex flex-col rounded-lg border border-border bg-card p-6">
      <Quote
        className="mb-3 h-5 w-5 text-muted-foreground/40"
        aria-hidden="true"
      />
      <p className="flex-1 text-sm leading-relaxed text-card-foreground">
        {testimonial.quote}
      </p>
      <footer className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <div>
          <p className="text-sm font-medium">{testimonial.client_name}</p>
          <p className="text-xs text-muted-foreground">
            {testimonial.client_role}
            {testimonial.company && `, ${testimonial.company}`}
          </p>
        </div>
      </footer>
    </blockquote>
  );
}

/* ─── Proof Item Card ─────────────────────────────────── */

function ProofItemCard({ item }: { item: { id: string; type: string; title: string; description: string; url: string | null; video_provider: string | null; video_id: string | null } }) {
  // Video proof
  if (item.type === "video" && item.video_provider && item.video_id) {
    return (
      <div className="rounded-lg border border-border bg-card p-5">
        <VideoEmbed
          provider={item.video_provider as "youtube" | "loom"}
          videoId={item.video_id}
          title={item.title}
        />
        <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
        {item.description && (
          <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
        )}
      </div>
    );
  }

  // External/Professional proof with URL
  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
      >
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{item.title}</p>
          {item.description && (
            <p className="text-xs text-muted-foreground">{item.description}</p>
          )}
        </div>
      </a>
    );
  }

  // Generic proof item
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold">{item.title}</h3>
      {item.description && (
        <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
      )}
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────── */

export async function Proof() {
  const [testimonials, proofItems] = await Promise.all([
    getPublishedTestimonials(),
    getPublishedProof(),
  ]);

  const hasContent = testimonials.length > 0 || proofItems.length > 0;

  if (!hasContent) {
    return null; // Don't render section if no published proof
  }

  return (
    <Section className="bg-surface-muted">
      <Container>
        {/* Header */}
        <div className="max-w-xl">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">
            Credibility
          </p>
          <H2 className="mt-2">Evidence behind the work</H2>
          <Body className="mt-2 text-muted-foreground">
            Real feedback, real systems, real results — not marketing claims.
          </Body>
        </div>

        <div className="mt-10 space-y-8">
          {/* Testimonials */}
          {testimonials.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          )}

          {/* Proof items */}
          {proofItems.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {proofItems.map((item) => (
                <ProofItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/work">
              Explore all work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
