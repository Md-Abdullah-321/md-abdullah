"use client";

import { useEffect, useRef } from "react";
import { pushDataLayerEvent } from "@/lib/analytics/data-layer";

/**
 * Fires exactly one `project_view` dataLayer event per project detail page
 * view.
 *
 * The ref remembers which slug this mounted instance already reported, so:
 * - React Strict Mode's double-effect in development does not double-fire;
 * - re-renders with the same props never re-fire;
 * - navigating between project pages (slug changes on a reused instance, or a
 *   full remount via the marketing template) fires once for each new page
 *   actually viewed.
 *
 * No timeouts, no DOM queries, no page-level viewport logic.
 */
export function ProjectViewTracker({
  slug,
  name,
  category,
}: {
  slug: string;
  name: string;
  category?: string | null;
}) {
  const firedForSlug = useRef<string | null>(null);

  useEffect(() => {
    if (firedForSlug.current === slug) return;
    firedForSlug.current = slug;
    pushDataLayerEvent({
      event: "project_view",
      project_name: name,
      project_slug: slug,
      project_category: category || undefined,
    });
  }, [slug, name, category]);

  return null;
}
