export type VideoProvider = "youtube" | "loom";

export type AspectRatio = "16:9" | "4:3" | "1:1" | "9:16";

export interface Video {
  id: string;
  provider: VideoProvider;
  videoId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  aspectRatio: AspectRatio;
}

export interface VideoEmbedConfig {
  provider: VideoProvider;
  videoId: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}
