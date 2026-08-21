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
