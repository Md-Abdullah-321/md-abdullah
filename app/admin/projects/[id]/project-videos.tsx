"use client";

import { useTransition, useState } from "react";
import { Plus, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProjectVideo, deleteProjectVideo } from "../actions";

interface VideoData {
  id: string;
  provider: string;
  video_id: string;
  title: string;
  description: string;
  sort_order: number;
}

interface ProjectVideosProps {
  projectId: string;
  videos: VideoData[];
}

export function ProjectVideos({ projectId, videos }: ProjectVideosProps) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      const result = await addProjectVideo(projectId, formData);
      if (result.success) {
        setShowForm(false);
      }
    });
  }

  function handleDelete(videoId: string, title: string) {
    if (!confirm(`Delete video "${title}"?`)) return;
    startTransition(async () => {
      await deleteProjectVideo(videoId, projectId);
    });
  }

  return (
    <fieldset className="space-y-4">
      <div className="flex items-center justify-between">
        <legend className="text-lg font-semibold">Videos</legend>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4" />
          Add Video
        </Button>
      </div>

      {/* Existing videos */}
      {videos.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">
          No videos attached to this project.
        </p>
      )}

      {videos.length > 0 && (
        <div className="space-y-2">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Video className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{video.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {video.provider} · {video.video_id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(video.id, video.title)}
                disabled={isPending}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form action={handleAdd} className="space-y-3 rounded-lg border border-border p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="provider" className="block text-xs font-medium">
                Provider
              </label>
              <select
                id="provider"
                name="provider"
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="youtube">YouTube</option>
                <option value="loom">Loom</option>
              </select>
            </div>
            <div>
              <label htmlFor="video_id" className="block text-xs font-medium">
                Video ID
              </label>
              <input
                type="text"
                id="video_id"
                name="video_id"
                required
                placeholder="e.g., dQw4w9WgXcQ"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="video_title" className="block text-xs font-medium">
              Title
            </label>
            <input
              type="text"
              id="video_title"
              name="title"
              required
              placeholder="Walkthrough title"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="video_desc" className="block text-xs font-medium">
              Description
            </label>
            <input
              type="text"
              id="video_desc"
              name="description"
              placeholder="Optional description"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <input type="hidden" name="sort_order" value="0" />
          <div className="flex gap-2">
            <Button type="submit" size="sm" loading={isPending}>
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </fieldset>
  );
}
