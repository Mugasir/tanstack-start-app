import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ShareButton } from "@/components/ShareButton";
import { format } from "date-fns";

export const Route = createFileRoute("/quote/$id")({
  loader: async ({ params }) => {
    const { data, error } = await supabase.from("daily_quotes").select("*").eq("id", params.id).eq("status", "published").maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return { quote: data };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const q = loaderData.quote;
    return {
      meta: [
        { title: `${q.title} — KMI Daily Word` },
        { name: "description", content: q.caption ?? "" },
        { property: "og:title", content: q.title },
        { property: "og:description", content: q.caption ?? "" },
        ...(q.image_url ? [{ property: "og:image", content: q.image_url }] : []),
      ],
    };
  },
  errorComponent: ({ error }) => <div className="p-20 text-center text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-20 text-center">Quote not found.</div>,
  component: QuotePage,
});

function QuotePage() {
  const { quote } = Route.useLoaderData();
  return (
    <article className="pt-28 pb-20 mx-auto max-w-3xl px-4">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back home
      </Link>
      {quote.image_url && <img src={quote.image_url} alt={quote.title} className="w-full rounded-2xl shadow-elegant mb-8" />}
      <h1 className="font-display text-3xl md:text-5xl font-bold">"{quote.title}"</h1>
      {quote.caption && <p className="text-muted-foreground mt-3 text-lg italic">{quote.caption}</p>}
      {quote.details && <p className="text-foreground/80 leading-relaxed mt-6 whitespace-pre-wrap">{quote.details}</p>}
      <div className="flex items-center justify-between mt-8 flex-wrap gap-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{format(new Date(quote.created_at), "PPP")}</p>
        <ShareButton path={`/quote/${quote.id}`} title={quote.title} text={quote.caption ?? undefined} variant="button" />
      </div>
    </article>
  );
}
