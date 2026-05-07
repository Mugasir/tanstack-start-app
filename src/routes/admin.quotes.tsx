import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/quotes")({
  component: () => (
    <CrudManager
      table="daily_quotes"
      title="Daily Quotes"
      imageKey="image_url"
      fields={[
        { key: "title", label: "Quote", kind: "text", required: true },
        { key: "caption", label: "Reference / source", kind: "text" },
        { key: "details", label: "Details", kind: "textarea" },
        { key: "image_url", label: "Background image (optional)", kind: "image" },
      ]}
    />
  ),
});
