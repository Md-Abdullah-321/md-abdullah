import { VideoForm } from "../video-form";

export default function NewVideoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Add Video</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a YouTube or Loom video to the library.
      </p>
      <div className="mt-8">
        <VideoForm />
      </div>
    </div>
  );
}
