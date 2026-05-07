import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ShareButton } from "@/components/ShareButton";
import { format } from "date-fns";

export const Route = createFileRoute("/gallery/$id")({
  loader: async ({ params }) => {
    const { data, error } = await supabase.from("gallery").select("*").eq("id", params.id).eq("status", "published").maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return { item: data };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.item.title} — KMI Gallery` },
          { name: "description", content: loaderData.item.caption ?? "KMI gallery item" },
          { property: "og:title", content: loaderData.item.title },
          { property: "og:description", content: loaderData.item.caption ?? "" },
          { property: "og:image", content: loaderData.item.image_url },
          { name: "twitter:image", content: loaderData.item.image_url },
        ]
      : [],
  }),
  errorComponent: ({ error }) => <div className="p-20 text-center text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-20 text-center">Item not found.</div>,
  component: GalleryItem,
});

function GalleryItem() {
  const { item } = Route.useLoaderData();
  return (
    <article className="pt-28 pb-20 mx-auto max-w-4xl px-4">
      <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to gallery
      </Link>
      <img src={item.image_url} alt={item.title} className="w-full rounded-2xl shadow-elegant mb-8" />
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h1 className="font-display text-3xl md:text-5xl font-bold">{item.title}</h1>
          {item.caption && <p className="text-muted-foreground mt-2 text-lg">{item.caption}</p>}
        </div>
        <ShareButton path={`/gallery/${item.id}`} title={item.title} text={item.caption ?? undefined} variant="button" />
      </div>
      {item.details && <p className="text-foreground/80 leading-relaxed mt-4">{item.details}</p>}
      <p className="text-xs uppercase tracking-widest text-muted-foreground mt-6">{format(new Date(item.created_at), "PPP")}</p>
    </article>
  );
}
