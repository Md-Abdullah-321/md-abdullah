import { Hero } from "@/components/sections/hero";
import { CommonPatterns } from "@/components/sections/common-patterns";
import { Methodology } from "@/components/sections/methodology";
import { SystemVisualization } from "@/components/sections/system-visualization";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Proof } from "@/components/sections/proof";
import { ServicesOverview } from "@/components/sections/services-overview";
import { FinalCTA } from "@/components/sections/final-cta";
import { HomepageAtmosphere } from "@/components/layout/homepage-atmosphere";
import { getSiteSettings } from "@/lib/supabase/settings";
import {
  generatePersonJsonLd,
  generateWebsiteJsonLd,
  JsonLd,
} from "@/lib/seo/structured-data";

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <JsonLd data={generatePersonJsonLd(settings)} />
      <JsonLd data={generateWebsiteJsonLd(settings)} />
      <HomepageAtmosphere>
        <Hero />
        <CommonPatterns />
        <Methodology />
        <SystemVisualization />
        <FeaturedWork />
        <Proof />
        <ServicesOverview />
        <FinalCTA />
      </HomepageAtmosphere>
    </>
  );
}
