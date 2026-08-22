/**
 * Resolve external image URLs for use in <img src>.
 * Google Drive share links return HTML, not image bytes.
 */

const GOOGLE_DRIVE_FILE_ID =
  /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=|drive\.google\.com\/uc(?:\?|&)(?:export=view&)?id=)([a-zA-Z0-9_-]+)/;

export function resolveExternalImageUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();
  const match = trimmed.match(GOOGLE_DRIVE_FILE_ID);

  if (match?.[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }

  return trimmed;
}
