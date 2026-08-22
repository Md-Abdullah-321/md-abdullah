/**
 * Analytics client — thin abstraction over provider.
 *
 * Uses Vercel Analytics (privacy-focused, cookie-free, ~1KB).
 * Page views are tracked automatically by the Analytics component.
 * Custom events use `track()` from @vercel/analytics.
 *
 * In development (no Vercel env), events are logged to console.
 * Analytics never blocks rendering or throws fatal errors.
 */

import { track as vercelTrack } from "@vercel/analytics";
import type { EventName, EventPayloads } from "./events";

/**
 * Track a custom analytics event.
 *
 * Usage:
 * ```ts
 * import { track } from "@/lib/analytics/client";
 * import { EVENTS } from "@/lib/analytics/events";
 *
 * track(EVENTS.PROJECT_VIEWED, { slug: "my-project" });
 * ```
 */
export function track<E extends EventName>(
  event: E,
  ...args: EventPayloads[E] extends undefined
    ? []
    : [properties: EventPayloads[E]]
): void {
  try {
    const properties = args[0] as Record<string, string | number | boolean | null> | undefined;
    vercelTrack(event, properties);
  } catch {
    // Analytics must never break the application
  }
}
