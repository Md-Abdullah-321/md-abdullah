/**
 * Email client — server-only.
 *
 * Uses Resend for transactional email delivery.
 * Only initialized when RESEND_API_KEY is configured.
 */

import { Resend } from "resend";

let resendClient: Resend | null = null;

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/**
 * Send a transactional email via Resend.
 * Returns true if sent successfully, false if failed or not configured.
 * Never throws — email failures are non-fatal.
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const client = getClient();
  if (!client) {
    console.warn("[Email] Resend not configured (RESEND_API_KEY missing). Email not sent.");
    return false;
  }

  const from = process.env.EMAIL_FROM || "Portfolio <onboarding@resend.dev>";

  try {
    const { error } = await client.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      ...(options.replyTo && { replyTo: options.replyTo }),
    });

    if (error) {
      console.error("[Email] Send failed:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Email] Unexpected error:", err);
    return false;
  }
}
