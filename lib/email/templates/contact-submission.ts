/**
 * Contact submission email template.
 *
 * Returns both HTML and plain-text versions.
 * Professional, clean, mobile-friendly.
 */

interface ContactEmailData {
  name: string;
  email: string;
  company: string | null;
  message: string;
  systems: string | null;
  submittedAt: Date;
  adminUrl?: string;
}

export function renderContactSubmissionEmail(data: ContactEmailData): {
  html: string;
  text: string;
} {
  const dateStr = data.submittedAt.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Plain text version
  const text = [
    "New Portfolio Inquiry",
    "=====================",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    ...(data.company ? [`Company: ${data.company}`] : []),
    ...(data.systems ? [`\nSystems/Tools: ${data.systems}`] : []),
    "",
    "Message:",
    data.message,
    "",
    `Submitted: ${dateStr}`,
    ...(data.adminUrl ? ["", `View in Admin: ${data.adminUrl}`] : []),
  ].join("\n");

  // HTML version
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 2px solid #e5e5e5; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="font-size: 20px; font-weight: 600; margin: 0;">New Portfolio Inquiry</h1>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 8px 0; color: #666; width: 100px; vertical-align: top;">Name</td>
      <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(data.name)}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #666; vertical-align: top;">Email</td>
      <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #1a1a1a;">${escapeHtml(data.email)}</a></td>
    </tr>
    ${data.company ? `<tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Company</td><td style="padding: 8px 0;">${escapeHtml(data.company)}</td></tr>` : ""}
    ${data.systems ? `<tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Systems</td><td style="padding: 8px 0; color: #666; font-size: 14px;">${escapeHtml(data.systems)}</td></tr>` : ""}
  </table>

  <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
    <p style="margin: 0 0 8px; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
    <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
  </div>

  <p style="font-size: 13px; color: #999; margin-bottom: 16px;">
    Submitted ${dateStr}
  </p>

  ${data.adminUrl ? `<a href="${data.adminUrl}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">View in Admin</a>` : ""}
</body>
</html>`.trim();

  return { html, text };
}

/** Escape HTML special characters to prevent injection */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
