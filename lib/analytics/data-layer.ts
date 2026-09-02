/**
 * dataLayer event definitions for Google Tag Manager.
 *
 * The site pushes ONLY these structured events into window.dataLayer. GTM
 * (GTM-NPD7HNCR) is configured separately to map them into GA4; this module
 * never calls gtag/GA4 directly.
 *
 * Privacy: never push PII (email addresses, phone numbers, names, message
 * content, query strings). Only stable, publicly visible identifiers that are
 * already on the page (semantic names, slugs, categories, methods).
 *
 * The push helper is safe to import from server and client code — it is a
 * no-op outside the browser and never throws.
 */

/* ─── Supported events ────────────────────────────────── */

export type DataLayerEvent =
  | {
      event: "cta_click";
      cta_name: "start_a_conversation" | "see_my_work" | "all_work";
      location:
        | "hero"
        | "header"
        | "next_step"
        | "featured_work"
        | "mobile_menu";
    }
  | {
      event: "project_view";
      project_name: string;
      project_slug: string;
      project_category?: string;
    }
  | {
      event: "project_website_click";
      project_name: string;
      project_slug: string;
      project_category?: string;
    }
  | {
      event: "contact_click";
      contact_method: "email" | "whatsapp" | "upwork" | "linkedin";
      location: "contact_page" | "footer";
    }
  | {
      event: "nav_click";
      destination:
        | "home"
        | "work"
        | "how_i_build"
        | "systems"
        | "about"
        | "contact";
      location: "header" | "mobile_menu" | "footer";
    }
  | {
      event: "video_play";
      video_name: string;
      video_provider: "youtube" | "loom";
      project_name?: string;
      project_slug?: string;
    }
  | {
      event: "video_progress";
      video_name: string;
      video_provider: "youtube" | "loom";
      progress_percent: 25 | 50 | 75;
      project_name?: string;
      project_slug?: string;
    }
  | {
      event: "video_complete";
      video_name: string;
      video_provider: "youtube" | "loom";
      project_name?: string;
      project_slug?: string;
    };

/* ─── Push helper ─────────────────────────────────────── */

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Push a structured event into window.dataLayer.
 *
 * - Browser-only: silently no-ops during SSR / when window is undefined.
 * - Initializes the array if GTM has not run yet (dataLayer = dataLayer || []).
 * - Never throws, so analytics can never break the application.
 */
export function pushDataLayerEvent(event: DataLayerEvent): void {
  try {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  } catch {
    // Analytics must never break the application.
  }
}
