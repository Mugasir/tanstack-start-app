import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ShareButton } from "@/components/ShareButton";
import { getEmbedUrl, getYouTubeThumbnail } from "@/lib/media";
import { format } from "date-fns";

export const Route = createFileRoute("/sermons/$id")({
  loader: async ({ params }) => {
    const { data, error } = await supabase.from("sermons").select("*").eq("id", params.id).eq("status", "published").maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return { sermon: data };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { sermon } = loaderData;
    const thumb = sermon.thumbnail_url || (sermon.media_type === "youtube" ? getYouTubeThumbnail(sermon.media_url) : null);
    return {
      meta: [
        { title: `${sermon.title} — KMI Sermons` },
        { name: "description", content: sermon.caption ?? "" },
        { property: "og:title", content: sermon.title },
        { property: "og:description", content: sermon.caption ?? "" },
        ...(thumb ? [{ property: "og:image", content: thumb }, { name: "twitter:image", content: thumb }] : []),
      ],
    };
  },
  errorComponent: ({ error }) => <div className="p-20 text-center text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-20 text-center">Sermon not found.</div>,
  component: SermonPage,
});

function SermonPage() {
  const { sermon } = Route.useLoaderData();
  const embed = getEmbedUrl(sermon.media_type, sermon.media_url);

  return (
    <article className="pt-28 pb-20 mx-auto max-w-5xl px-4">
      <Link to="/sermons" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to sermons
      </Link>
      <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-elegant mb-8">
        {sermon.media_type === "upload" ? (
          <video src={sermon.media_url} controls className="w-full h-full" />
        ) : embed ? (
          <iframe src={embed} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={sermon.title} />
        ) : (
          <a href={sermon.media_url} target="_blank" rel="noreferrer" className="w-full h-full grid place-items-center text-white">
            Watch externally →
          </a>
        )}
      </div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h1 className="font-display text-3xl md:text-5xl font-bold">{sermon.title}</h1>
          {sermon.caption && <p className="text-muted-foreground mt-2 text-lg">{sermon.caption}</p>}
        </div>
        <ShareButton path={`/sermons/${sermon.id}`} title={sermon.title} text={sermon.caption ?? undefined} variant="button" />
      </div>
      {sermon.details && <div className="prose max-w-none mt-4 text-foreground/80 leading-relaxed whitespace-pre-wrap">{sermon.details}</div>}
      <p className="text-xs uppercase tracking-widest text-muted-foreground mt-8">{format(new Date(sermon.created_at), "PPP")}</p>
    </article>
  );
}
