import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/livestream")({
  component: () => (
    <CrudManager
      table="livestream"
      title="Live Stream"
      fields={[
        { key: "title", label: "Title", kind: "text", required: true },
        { key: "caption", label: "Caption", kind: "text" },
        { key: "details", label: "Details", kind: "textarea" },
        { key: "embed_url", label: "YouTube live URL", kind: "media", required: true },
        { key: "is_live", label: "Currently live?", kind: "switch" },
      ]}
    />
  ),
});
