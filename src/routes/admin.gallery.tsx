import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/gallery")({
  component: () => (
    <CrudManager
      table="gallery"
      title="Gallery"
      imageKey="image_url"
      fields={[
        { key: "title", label: "Title", kind: "text", required: true },
        { key: "caption", label: "Caption", kind: "text" },
        { key: "details", label: "Details", kind: "textarea" },
        { key: "image_url", label: "Image", kind: "image", required: true },
      ]}
    />
  ),
});
