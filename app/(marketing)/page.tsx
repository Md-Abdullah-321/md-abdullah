import { Hero } from "@/components/sections/hero";
import { ProblemRecognition } from "@/components/sections/problem-recognition";
import { Approach } from "@/components/sections/approach";
import { SystemVisualization } from "@/components/sections/system-visualization";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Proof } from "@/components/sections/proof";
import { ServicesOverview } from "@/components/sections/services-overview";
import { FinalCTA } from "@/components/sections/final-cta";
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
      <Hero />
      <ProblemRecognition />
      <Approach />
      <SystemVisualization />
      <FeaturedWork />
      <Proof />
      <ServicesOverview />
      <FinalCTA />
    </>
  );
}
