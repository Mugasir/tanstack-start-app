import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BackgroundCarousel } from "@/components/BackgroundCarousel";
import { getYouTubeThumbnail } from "@/lib/media";
import { format } from "date-fns";
import g3 from "@/assets/photos/kmi-3.jpg";
import g6 from "@/assets/photos/kmi-6.jpg";
import g8 from "@/assets/photos/kmi-8.jpg";

interface Sermon {
  id: string;
  title: string;
  caption: string | null;
  details: string | null;
  thumbnail_url: string | null;
  media_url: string;
  media_type: string;
  created_at: string;
}

export const Route = createFileRoute("/sermons")({
  head: () => ({
    meta: [
      { title: "Sermons — Kanyinasheema Ministries International" },
      { name: "description", content: "Watch and listen to sermons from General Hamilo and KMI." },
      { property: "og:title", content: "KMI Sermons" },
      { property: "og:description", content: "Be filled with the Word." },
    ],
  }),
  component: Sermons,
});

function Sermons() {
  const [items, setItems] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("sermons").select("*").eq("status", "published").order("created_at", { ascending: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  return (
    <>
      <section className="relative h-[45svh] min-h-[360px] flex items-end overflow-hidden">
        <BackgroundCarousel images={[g3, g6, g8]} />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 text-white">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Sermons</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold">Be Filled With The Word</h1>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-7xl px-4">
        {loading ? (
          <div className="text-center text-muted-foreground py-20">Loading sermons…</div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">No sermons yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((s) => {
              const thumb = s.thumbnail_url || (s.media_type === "youtube" ? getYouTubeThumbnail(s.media_url) : null);
              return (
                <Link key={s.id} to="/sermons/$id" params={{ id: s.id }} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-elegant hover:-translate-y-1 transition-all">
                  <div className="aspect-video relative bg-black">
                    {thumb ? <img src={thumb} alt={s.title} loading="lazy" className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                    <div className="absolute inset-0 grid place-items-center bg-black/30 group-hover:bg-black/10 transition">
                      <div className="w-14 h-14 rounded-full grid place-items-center" style={{ background: "var(--gradient-gold)" }}>
                        <Play className="w-6 h-6 text-primary fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold line-clamp-2">{s.title}</h3>
                    {s.caption && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.caption}</p>}
                    <p className="text-xs text-muted-foreground/70 mt-2">{format(new Date(s.created_at), "PPP")}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
