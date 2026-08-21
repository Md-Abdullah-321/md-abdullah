import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VideoForm } from "../video-form";

export default async function EditVideoPage(
  props: PageProps<"/admin/videos/[id]">
) {
  const { id } = await props.params;

  const supabase = await createClient();
  const { data: video, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !video) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit: {video.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {video.provider} · {video.published ? "Published" : "Draft"}
      </p>
      <div className="mt-8">
        <VideoForm video={video} />
      </div>
    </div>
  );
}
