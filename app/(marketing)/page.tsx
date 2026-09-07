import { Hero, type HeroVideoData } from "@/components/sections/hero";
import { CommonPatterns } from "@/components/sections/common-patterns";
import { Methodology } from "@/components/sections/methodology";
import { SystemVisualization } from "@/components/sections/system-visualization";
import { FeaturedWork } from "@/components/sections/featured-work";
import { ServicesOverview } from "@/components/sections/services-overview";
import { FinalCTA } from "@/components/sections/final-cta";
import { HomepageAtmosphere } from "@/components/layout/homepage-atmosphere";
import { getSiteSettings } from "@/lib/supabase/settings";
import { getHomepageHeroTestimonials } from "@/lib/supabase/queries";
import { parseVideoUrl } from "@/lib/videos/providers";
import { generateWebsiteJsonLd, JsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const settings = await getSiteSettings();
  const heroTestimonials = await getHomepageHeroTestimonials(settings.hero_testimonial_id);
  const heroProofs = heroTestimonials.map((t) => ({
    id: t.id,
    quote: t.quote,
    highlight: t.highlight_text ?? null,
    attribution: t.company
      ? `${t.client_name} · ${t.company}`
      : t.client_name,
  }));
  const heroProof = heroProofs[0] ?? null;
  let video: HeroVideoData | null = null;
  if (settings.hero_video_url) {
    const parsed = parseVideoUrl(settings.hero_video_url);
    if (parsed) video = { provider: parsed.provider, videoId: parsed.videoId };
  }
  return <><JsonLd data={generateWebsiteJsonLd(settings)} /><HomepageAtmosphere><Hero proof={heroProof} proofs={heroProofs} video={video} /><CommonPatterns /><Methodology /><SystemVisualization /><FeaturedWork /><ServicesOverview /><FinalCTA /></HomepageAtmosphere></>;
}
