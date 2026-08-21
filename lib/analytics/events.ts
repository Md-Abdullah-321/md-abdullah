/**
 * Analytics event definitions.
 *
 * Centralized event names and payload types.
 * All tracking goes through the `track()` function in client.ts.
 *
 * Privacy: Never send PII (email, name, message content).
 * Only send identifiers already publicly visible on the page.
 */

import type { VideoProvider } from "@/types";

/* ─── Event Names ─────────────────────────────────────── */

export const EVENTS = {
  CONTACT_FORM_STARTED: "contact_form_started",
  CONTACT_FORM_SUBMITTED: "contact_form_submitted",
  CONTACT_FORM_ERROR: "contact_form_error",
  PROJECT_VIEWED: "project_viewed",
  SERVICE_VIEWED: "service_viewed",
  VIDEO_PLAYED: "video_played",
  EXTERNAL_PROFILE_CLICKED: "external_profile_clicked",
  CONTACT_CTA_CLICKED: "contact_cta_clicked",
} as const;

/* ─── Event Payloads ──────────────────────────────────── */

export interface EventPayloads {
  [EVENTS.CONTACT_FORM_STARTED]: undefined;
  [EVENTS.CONTACT_FORM_SUBMITTED]: undefined;
  [EVENTS.CONTACT_FORM_ERROR]: { reason?: string };
  [EVENTS.PROJECT_VIEWED]: { slug: string; category?: string };
  [EVENTS.SERVICE_VIEWED]: { slug: string };
  [EVENTS.VIDEO_PLAYED]: {
    provider: VideoProvider;
    video_id: string;
    context?: string;
  };
  [EVENTS.EXTERNAL_PROFILE_CLICKED]: { platform: string };
  [EVENTS.CONTACT_CTA_CLICKED]: { location: string };
}

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
