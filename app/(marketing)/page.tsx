import { HomeStory } from "@/components/sections/home-story/home-story";
import { getSiteSettings } from "@/lib/supabase/settings";
import { generateWebsiteJsonLd, JsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const settings = await getSiteSettings();
  return (
    <>
      <JsonLd data={generateWebsiteJsonLd(settings)} />
      <HomeStory />
    </>
  );
}
