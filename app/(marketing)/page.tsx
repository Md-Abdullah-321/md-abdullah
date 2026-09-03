import { Hero } from "@/components/sections/hero";
import { CommonPatterns } from "@/components/sections/common-patterns";
import { Methodology } from "@/components/sections/methodology";
import { SystemVisualization } from "@/components/sections/system-visualization";
import { FeaturedWork } from "@/components/sections/featured-work";
import { ServicesOverview } from "@/components/sections/services-overview";
import { FinalCTA } from "@/components/sections/final-cta";
import { HomepageAtmosphere } from "@/components/layout/homepage-atmosphere";
import { getSiteSettings } from "@/lib/supabase/settings";
import { getHomepageHeroTestimonial } from "@/lib/supabase/queries";
import { generateWebsiteJsonLd, JsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const settings = await getSiteSettings();
  const heroTestimonial = await getHomepageHeroTestimonial(settings.hero_testimonial_id);
  const heroProof = heroTestimonial
    ? {
        quote: heroTestimonial.quote,
        highlight: heroTestimonial.highlight_text,
        attribution: heroTestimonial.company
          ? `${heroTestimonial.client_name} · ${heroTestimonial.company}`
          : heroTestimonial.client_name,
      }
    : null;
  return <><JsonLd data={generateWebsiteJsonLd(settings)} /><HomepageAtmosphere><Hero proof={heroProof} /><CommonPatterns /><Methodology /><SystemVisualization /><FeaturedWork /><ServicesOverview /><FinalCTA /></HomepageAtmosphere></>;
}
