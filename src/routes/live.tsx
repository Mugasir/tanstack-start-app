import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BackgroundCarousel } from "@/components/BackgroundCarousel";
import { ShareButton } from "@/components/ShareButton";
import { getYouTubeEmbed } from "@/lib/media";
import { format } from "date-fns";
import g1 from "@/assets/photos/kmi-1.jpg";
import g5 from "@/assets/photos/kmi-5.jpg";
import g7 from "@/assets/photos/kmi-7.jpg";

interface Stream {
  id: string;
  title: string;
  caption: string | null;
  details: string | null;
  embed_url: string;
  is_live: boolean;
  created_at: string;
}

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Stream — Kanyinasheema Ministries International" },
      { name: "description", content: "Watch KMI live services online." },
      { property: "og:title", content: "KMI Live Stream" },
      { property: "og:description", content: "Join us live for prayer and worship." },
    ],
  }),
  component: Live,
});

function Live() {
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("livestream").select("*").eq("status", "published").order("created_at", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => { setStream(data); setLoading(false); });
  }, []);

  const embed = stream ? getYouTubeEmbed(stream.embed_url) ?? stream.embed_url : null;

  return (
    <>
      <section className="relative min-h-[100svh] flex items-center pt-24 pb-16 overflow-hidden">
        <BackgroundCarousel images={[g1, g5, g7]} />
        <div className="relative mx-auto max-w-6xl px-4 w-full">
          <div className="text-center text-white mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-xs uppercase tracking-[0.2em] mb-4">
              <span className={`w-2 h-2 rounded-full ${stream?.is_live ? "bg-red-500 animate-pulse" : "bg-white/40"}`} />
              {stream?.is_live ? "Live Now" : "Live Stream"}
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold">{stream?.title ?? "Watch Service Online"}</h1>
            {stream?.caption && <p className="text-white/80 mt-3 max-w-2xl mx-auto">{stream.caption}</p>}
          </div>

          <div className="glass-card rounded-2xl overflow-hidden shadow-elegant max-w-5xl mx-auto">
            <div className="aspect-video bg-black">
              {loading ? (
                <div className="w-full h-full grid place-items-center text-white/60">Loading…</div>
              ) : embed ? (
                <iframe src={embed} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={stream?.title ?? "Live"} />
              ) : (
                <div className="w-full h-full grid place-items-center text-white/70">
                  <div className="text-center">
                    <Play className="w-12 h-12 mx-auto mb-3 opacity-60" />
                    <p>No stream scheduled. Please check back soon.</p>
                  </div>
                </div>
              )}
            </div>
            {stream && (
              <div className="p-6 bg-card flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  {stream.details && <p className="text-foreground/80 text-sm">{stream.details}</p>}
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mt-3">{format(new Date(stream.created_at), "PPP p")}</p>
                </div>
                <ShareButton path={`/live`} title={stream.title} text={stream.caption ?? undefined} variant="button" />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
