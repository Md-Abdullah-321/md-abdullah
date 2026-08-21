"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2, Globe, GlobeLock, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { publishVideo, unpublishVideo, deleteVideo } from "./actions";

interface VideoRow {
  id: string;
  title: string;
  provider: string;
  video_id: string;
  published: boolean;
  updated_at: string;
}

export function VideosTable({ videos }: { videos: VideoRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Title</th>
            <th className="px-4 py-3 text-left font-medium">Provider</th>
            <th className="px-4 py-3 text-left font-medium">Video ID</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <VideoRowItem key={video.id} video={video} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VideoRowItem({ video }: { video: VideoRow }) {
  const [isPending, startTransition] = useTransition();

  function handlePublishToggle() {
    startTransition(async () => {
      if (video.published) {
        await unpublishVideo(video.id);
      } else {
        await publishVideo(video.id);
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete video "${video.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteVideo(video.id);
    });
  }

  return (
    <tr className={cn("border-b border-border transition-opacity", isPending && "opacity-50")}>
      <td className="px-4 py-3 font-medium">{video.title}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          {video.provider === "youtube" && <Video className="h-3 w-3" />}
          {video.provider}
        </span>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
        {video.video_id.length > 16
          ? video.video_id.slice(0, 16) + "..."
          : video.video_id}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            video.published
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          )}
        >
          {video.published ? (
            <><Globe className="h-3 w-3" /> Published</>
          ) : (
            <><GlobeLock className="h-3 w-3" /> Draft</>
          )}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/videos/${video.id}`}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handlePublishToggle}
            disabled={isPending}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title={video.published ? "Unpublish" : "Publish"}
          >
            {video.published ? <GlobeLock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
