import type { SiteSettings } from "@/lib/supabase/settings";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Generate Person JSON-LD structured data.
 * Used on the homepage and about page.
 */
export function generatePersonJsonLd(settings: SiteSettings) {
  const sameAs: string[] = [];
  if (settings.link_linkedin) sameAs.push(settings.link_linkedin);
  if (settings.link_github) sameAs.push(settings.link_github);
  if (settings.link_upwork) sameAs.push(settings.link_upwork);
  if (settings.link_youtube) sameAs.push(settings.link_youtube);
  if (settings.link_twitter) sameAs.push(settings.link_twitter);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.name || "Md Abdullah",
    jobTitle: settings.title || "Automation & Integration Engineer",
    url: SITE_URL,
    ...(settings.profile_image_url && { image: settings.profile_image_url }),
    ...(settings.public_email && { email: `mailto:${settings.public_email}` }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/**
 * Generate WebSite JSON-LD structured data.
 */
export function generateWebsiteJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.name || "Md Abdullah",
    url: SITE_URL,
    description:
      settings.site_description ||
      "Automation & Integration Engineer helping businesses connect their tools and automate repetitive work.",
  };
}

/**
 * Render JSON-LD script tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
