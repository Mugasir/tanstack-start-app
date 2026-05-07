import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ShareButton } from "@/components/ShareButton";
import { format } from "date-fns";
import banner from "@/assets/photos/kmi-6.jpg";

interface GalleryItem {
  id: string;
  title: string;
  caption: string | null;
  details: string | null;
  image_url: string;
  created_at: string;
}

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Kanyinasheema Ministries International" },
      { name: "description", content: "Moments of worship, fellowship and ministry at KMI." },
      { property: "og:title", content: "KMI Gallery" },
      { property: "og:description", content: "Moments of worship, fellowship and ministry." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("gallery").select("*").eq("status", "published").order("created_at", { ascending: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  return (
    <>
      <section className="relative h-[40svh] min-h-[320px] flex items-end overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${banner})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 text-white">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Gallery</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold">Moments of Glory</h1>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-7xl px-4">
        {loading ? (
          <div className="text-center text-muted-foreground py-20">Loading gallery…</div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">No gallery items yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item)}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary"
              >
                <img src={item.image_url} alt={item.title} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <div className="text-white text-left">
                    <div className="text-sm font-semibold line-clamp-1">{item.title}</div>
                    {item.caption && <div className="text-xs text-white/70 line-clamp-1">{item.caption}</div>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {active && (
        <div className="fixed inset-0 z-[100] bg-black/90 grid place-items-center p-4 animate-fade-up" onClick={() => setActive(null)}>
          <button onClick={() => setActive(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full glass-dark text-white grid place-items-center">
            <X />
          </button>
          <div className="max-w-5xl w-full glass-card rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img src={active.image_url} alt={active.title} className="w-full max-h-[70vh] object-contain bg-black" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <h2 className="font-display text-2xl font-bold">{active.title}</h2>
                  {active.caption && <p className="text-muted-foreground mt-1">{active.caption}</p>}
                  {active.details && <p className="text-sm text-foreground/80 mt-3">{active.details}</p>}
                  <p className="text-xs text-muted-foreground mt-3">{format(new Date(active.created_at), "PPP")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton path={`/gallery/${active.id}`} title={active.title} text={active.caption ?? undefined} variant="button" />
                  <Link to="/gallery/$id" params={{ id: active.id }} className="text-sm text-primary font-medium hover:underline">Open page</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
