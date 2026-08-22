"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getThumbnailUrl } from "@/lib/videos/providers";
import type { VideoProvider } from "@/types";
import { createVideo, updateVideo } from "./actions";


interface VideoData {
  id?: string;
  title: string;
  description: string;
  provider: string;
  video_id: string;
  thumbnail_url: string | null;
  published: boolean;
}

const initialResult = { success: false, error: undefined as string | undefined };

export function VideoForm({ video }: { video?: VideoData }) {
  const isEditing = !!video?.id;
  const boundAction = isEditing
    ? updateVideo.bind(null, video!.id!)
    : createVideo;

  const [state, formAction, isPending] = useActionState(boundAction, initialResult);

  // Generate thumbnail preview URL
  const previewThumb =
    video?.provider && video?.video_id
      ? getThumbnailUrl(video.provider as VideoProvider, video.video_id)
      : null;

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      {state.success && isEditing && (
        <div className="rounded-md bg-success/10 px-4 py-3 text-sm text-success">
          Video saved successfully.
        </div>
      )}

      {/* Details */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Video Details</legend>

        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={video?.title ?? ""}
            placeholder="e.g., CRM Automation Walkthrough"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={video?.description ?? ""}
            placeholder="What this video demonstrates"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </fieldset>

      {/* Provider */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Provider</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="provider" className="block text-sm font-medium">
              Platform <span className="text-destructive">*</span>
            </label>
            <select
              id="provider"
              name="provider"
              required
              defaultValue={video?.provider ?? "youtube"}
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="youtube">YouTube</option>
              <option value="loom">Loom</option>
            </select>
          </div>

          <div>
            <label htmlFor="video_id" className="block text-sm font-medium">
              Video ID or URL <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="video_id"
              name="video_id"
              required
              defaultValue={video?.video_id ?? ""}
              placeholder="Paste video URL or ID"
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Accepts full URL (e.g., https://youtube.com/watch?v=...) or just the video ID.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="thumbnail_url" className="block text-sm font-medium">
            Custom Thumbnail URL
          </label>
          <input
            type="url"
            id="thumbnail_url"
            name="thumbnail_url"
            defaultValue={video?.thumbnail_url ?? ""}
            placeholder="Leave blank to use provider default"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Preview thumbnail */}
        {previewThumb && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">Preview thumbnail</p>
            <div className="mt-2 aspect-video w-full max-w-sm overflow-hidden rounded-md border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video?.thumbnail_url || previewThumb}
                alt="Video thumbnail preview"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </fieldset>

      {/* Publishing */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Publishing</legend>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            name="published"
            defaultChecked={video?.published ?? false}
            className="h-4 w-4 rounded border-input"
          />
          <label htmlFor="published" className="text-sm font-medium">
            Published (visible on public site)
          </label>
        </div>
      </fieldset>

      {/* Submit */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button type="submit" loading={isPending}>
          {isEditing ? "Save Changes" : "Add Video"}
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/admin/videos">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
