import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/sermons")({
  component: () => (
    <CrudManager
      table="sermons"
      title="Sermons"
      imageKey="thumbnail_url"
      fields={[
        { key: "title", label: "Title", kind: "text", required: true },
        { key: "caption", label: "Short caption", kind: "text" },
        { key: "details", label: "Details", kind: "textarea" },
        { key: "media_url", label: "YouTube / TikTok link or video upload", kind: "media", required: true },
        { key: "thumbnail_url", label: "Thumbnail (optional, auto-detected for YouTube)", kind: "image" },
      ]}
    />
  ),
});
