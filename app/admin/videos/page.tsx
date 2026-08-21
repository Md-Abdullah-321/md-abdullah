import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { VideosTable } from "./videos-table";

export default async function AdminVideosPage() {
  let videos: { id: string; title: string; provider: string; video_id: string; published: boolean; updated_at: string }[] = [];
  let error: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error: fetchError } = await supabase
      .from("videos")
      .select("id, title, provider, video_id, published, updated_at")
      .order("created_at", { ascending: false });

    if (fetchError) throw fetchError;
    videos = data ?? [];
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load videos.";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Videos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage YouTube and Loom video walkthroughs.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/videos/new">
            <Plus className="h-4 w-4" />
            Add Video
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : videos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">No videos yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add YouTube or Loom videos to use in projects and proof.
            </p>
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link href="/admin/videos/new">
                <Plus className="h-4 w-4" />
                Add Video
              </Link>
            </Button>
          </div>
        ) : (
          <VideosTable videos={videos} />
        )}
      </div>
    </div>
  );
}
