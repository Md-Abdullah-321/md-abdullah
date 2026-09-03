import { Hero } from "@/components/sections/hero";
import { CommonPatterns } from "@/components/sections/common-patterns";
import { Methodology } from "@/components/sections/methodology";
import { SystemVisualization } from "@/components/sections/system-visualization";
import { FeaturedWork } from "@/components/sections/featured-work";
import { ServicesOverview } from "@/components/sections/services-overview";
import { FinalCTA } from "@/components/sections/final-cta";
import { HomepageAtmosphere } from "@/components/layout/homepage-atmosphere";
import { getSiteSettings } from "@/lib/supabase/settings";
import { getHomepageHeroTestimonials } from "@/lib/supabase/queries";
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
  return <><JsonLd data={generateWebsiteJsonLd(settings)} /><HomepageAtmosphere><Hero proof={heroProof} proofs={heroProofs} /><CommonPatterns /><Methodology /><SystemVisualization /><FeaturedWork /><ServicesOverview /><FinalCTA /></HomepageAtmosphere></>;
}
