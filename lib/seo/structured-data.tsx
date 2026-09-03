import type { SiteSettings } from "@/lib/supabase/settings";
import { SITE_URL } from "@/lib/constants";

/**
 * Generate Person JSON-LD structured data.
 * Used on the About page.
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/work?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate CreativeWork JSON-LD for a project case study.
 * Used on project detail pages (/work/[slug]).
 */
export function generateProjectJsonLd(input: {
  title: string;
  slug: string;
  description: string;
  authorName: string;
  authorUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.title,
    url: `${SITE_URL}/work/${input.slug}`,
    description: input.description,
    author: {
      "@type": "Person",
      name: input.authorName,
      url: input.authorUrl,
    },
    about: "Business process automation",
    inLanguage: "en",
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
