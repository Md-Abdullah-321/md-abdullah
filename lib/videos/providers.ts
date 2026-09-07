import type { VideoProvider } from "@/types";

interface ProviderConfig {
  name: string;
  getEmbedUrl: (videoId: string, options?: EmbedOptions) => string;
  getThumbnailUrl: (videoId: string) => string;
}

interface EmbedOptions {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

const providers: Record<VideoProvider, ProviderConfig> = {
  youtube: {
    name: "YouTube",
    getEmbedUrl(videoId, options = {}) {
      const params = new URLSearchParams();
      if (options.autoplay) params.set("autoplay", "1");
      if (options.muted) params.set("mute", "1");
      if (options.loop) params.set("loop", "1");
      params.set("rel", "0");
      const query = params.toString();
      return `https://www.youtube-nocookie.com/embed/${videoId}${query ? `?${query}` : ""}`;
    },
    getThumbnailUrl(videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    },
  },
  loom: {
    name: "Loom",
    getEmbedUrl(videoId, options = {}) {
      const params = new URLSearchParams();
      if (options.autoplay) params.set("autoplay", "1");
      params.set("hide_owner", "true");
      params.set("hide_share", "true");
      params.set("hide_title", "true");
      const query = params.toString();
      return `https://www.loom.com/embed/${videoId}${query ? `?${query}` : ""}`;
    },
    getThumbnailUrl(videoId) {
      return `https://cdn.loom.com/sessions/thumbnails/${videoId}-with-play.gif`;
    },
  },
};

export function getProvider(provider: VideoProvider): ProviderConfig {
  return providers[provider];
}

export function getEmbedUrl(
  provider: VideoProvider,
  videoId: string,
  options?: EmbedOptions
): string {
  return providers[provider].getEmbedUrl(videoId, options);
}

export function getThumbnailUrl(
  provider: VideoProvider,
  videoId: string
): string {
  return providers[provider].getThumbnailUrl(videoId);
}

interface ParsedVideo {
  provider: VideoProvider;
  videoId: string;
}

/**
 * Parse a YouTube or Loom share/embed URL into its provider and video id.
 * Returns null when the URL is not a recognizable provider link.
 */
export function parseVideoUrl(rawUrl: string): ParsedVideo | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  // YouTube — watch, youtu.be, embed, shorts, live
  if (host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? { provider: "youtube", videoId: id } : null;
    }
    const id = url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean)[1];
    return id ? { provider: "youtube", videoId: id } : null;
  }

  // Loom — share and embed forms
  if (host === "loom.com" || host === "app.loom.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    // /share/<id> and /embed/<id>
    if (parts[0] === "share" || parts[0] === "embed") {
      const id = parts[1];
      return id ? { provider: "loom", videoId: id } : null;
    }
  }

  return null;
}
