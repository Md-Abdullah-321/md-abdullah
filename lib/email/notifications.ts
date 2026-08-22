/**
 * Email notification triggers.
 *
 * Each function represents a specific notification type.
 * Notifications are non-blocking — failures are logged but never
 * propagate to the caller as errors.
 */

import { sendEmail } from "./client";
import { renderContactSubmissionEmail } from "./templates/contact-submission";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface ContactNotificationData {
  id?: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  systems: string | null;
  submittedAt: Date;
}

/**
 * Send notification when a new contact form submission is received.
 * Non-blocking — returns false if email not configured or delivery fails.
 */
export async function notifyContactSubmission(
  data: ContactNotificationData
): Promise<boolean> {
  const recipientEmail = process.env.CONTACT_EMAIL;
  if (!recipientEmail) {
    console.warn("[Email] CONTACT_EMAIL not configured. Notification skipped.");
    return false;
  }

  const adminUrl = data.id ? `${SITE_URL}/admin/messages/${data.id}` : undefined;

  const { html, text } = renderContactSubmissionEmail({
    ...data,
    adminUrl,
  });

  return sendEmail({
    to: recipientEmail,
    subject: `New Inquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`,
    html,
    text,
    replyTo: data.email,
  });
}
