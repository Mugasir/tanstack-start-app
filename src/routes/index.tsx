import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play, Quote, Sparkles, Phone, MessageCircle, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BackgroundCarousel } from "@/components/BackgroundCarousel";
import { format } from "date-fns";
import { getYouTubeEmbed, getYouTubeThumbnail } from "@/lib/media";

import hero from "@/assets/photos/hero.jpg";
import hamilo from "@/assets/photos/hamilo.jpg";
import g1 from "@/assets/photos/kmi-1.jpg";
import g2 from "@/assets/photos/kmi-2.jpg";
import g3 from "@/assets/photos/kmi-3.jpg";
import g4 from "@/assets/photos/kmi-4.jpg";
import g5 from "@/assets/photos/kmi-5.jpg";
import g6 from "@/assets/photos/kmi-6.jpg";
import g7 from "@/assets/photos/kmi-7.jpg";
import g8 from "@/assets/photos/kmi-8.jpg";
import g9 from "@/assets/photos/kmi-9.jpg";

const heroCarousel = [hero, g2, g4, g6, g8];
const galleryCarousel = [g1, g2, g3, g4, g5];
const sermonCarousel = [g6, g7, g8, g9];
const liveCarousel = [g3, g5, g7, g9];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kanyinasheema Ministries International — Home" },
      { name: "description", content: "Welcome to KMI. Join us for prayer, prophecy, healing and deliverance with General Hamilo." },
      { property: "og:title", content: "Kanyinasheema Ministries International" },
      { property: "og:description", content: "Prayer • Prophecy • Healing • Deliverance" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Welcome />
      <OverseerCard />
      <FeaturedLive />
      <SermonsPreview />
      <GalleryPreview />
      <DailyQuote />
      <QuickContact />
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <BackgroundCarousel images={heroCarousel} intervalMs={6000} overlayClassName="" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.10 0.06 265 / 0.92) 0%, oklch(0.15 0.10 265 / 0.55) 45%, oklch(0.10 0.06 265 / 0.97) 100%)" }} />
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 30% 20%, oklch(0.78 0.14 80 / 0.45), transparent 55%), radial-gradient(ellipse at 75% 80%, oklch(0.5 0.21 25 / 0.35), transparent 60%)" }} />
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-white animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-xs uppercase tracking-[0.2em] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-gold" /> Welcome to the House of Glory
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.02] mb-6 drop-shadow-2xl">
          Encounter The <br />
          <span className="text-gradient-gold">Power of God</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base md:text-xl text-white/90 mb-10 leading-relaxed font-light">
          Kanyinasheema Ministries International — a house of <span className="text-gold font-medium">prayer, prophecy, healing</span> and
          deliverance, where lives are restored and destinies transformed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/live"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-glow hover:scale-105 transition-transform"
            style={{ background: "var(--gradient-gold)", color: "var(--gold-foreground)" }}
          >
            <Play className="w-5 h-5 fill-current" /> Join Live Service
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium glass-dark text-white hover:bg-white/15 transition"
          >
            Discover KMI <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs tracking-widest uppercase animate-bounce">
        Scroll
      </div>
    </section>
  );
}

function Welcome() {
  return (
    <section className="section-pad mx-auto max-w-5xl px-4 text-center">
      <div className="text-xs uppercase tracking-[0.25em] text-gold mb-4">A Word of Welcome</div>
      <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
        You are <span className="text-gradient-gold">welcome here</span>
      </h2>
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
        Whatever brought you here today — a longing, a question, a burden — know that
        the Father has been waiting for you. KMI is a place of encounter, where the
        Word of God is preached without compromise and the Holy Spirit moves in power.
      </p>
    </section>
  );
}

function OverseerCard() {
  return (
    <section className="relative section-pad overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: `url(${hamilo})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.15 0.08 265 / 0.92), oklch(0.25 0.12 265 / 0.78))" }} />
      <div className="relative mx-auto max-w-5xl px-4">
        <div className="glass-card rounded-3xl p-6 md:p-12 grid md:grid-cols-[260px_1fr] gap-8 items-center shadow-elegant">
          <div className="relative mx-auto">
            <div className="absolute -inset-2 rounded-full opacity-60 blur-xl" style={{ background: "var(--gradient-gold)" }} />
            <img src={hamilo} alt="General Hamilo" className="relative w-48 h-48 md:w-60 md:h-60 rounded-full object-cover ring-4 ring-white shadow-elegant" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-gold mb-2">General Overseer</div>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">General Hamilo</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              General Hamilo leads Kanyinasheema Ministries International through prayer,
              prophetic ministry, healing, and deliverance. His leadership focuses on
              spiritual growth, restoration, and transformation.
            </p>
            <Link
              to="/overseer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Read Full Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedLive() {
  const [stream, setStream] = useState<{ id: string; title: string; embed_url: string; caption: string | null } | null>(null);
  useEffect(() => {
    supabase.from("livestream").select("id,title,embed_url,caption").eq("status", "published").order("created_at", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => setStream(data));
  }, []);

  const embed = stream ? getYouTubeEmbed(stream.embed_url) ?? stream.embed_url : null;

  return (
    <section className="relative section-pad overflow-hidden">
      <BackgroundCarousel images={liveCarousel} />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="text-center mb-10 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-dark text-xs uppercase tracking-widest mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Featured Live
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold">Watch Service Online</h2>
        </div>
        <div className="glass-card rounded-2xl overflow-hidden shadow-elegant">
          <div className="aspect-video bg-black">
            {embed ? (
              <iframe src={embed} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={stream?.title ?? "Live"} />
            ) : (
              <div className="w-full h-full grid place-items-center text-white/70">
                <div className="text-center">
                  <Play className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm">No live stream scheduled. Check back soon.</p>
                </div>
              </div>
            )}
          </div>
          {stream && (
            <div className="p-6 bg-card">
              <h3 className="font-display text-xl font-semibold">{stream.title}</h3>
              {stream.caption && <p className="text-muted-foreground text-sm mt-1">{stream.caption}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SermonsPreview() {
  const [sermons, setSermons] = useState<Array<{ id: string; title: string; caption: string | null; thumbnail_url: string | null; media_url: string; media_type: string }>>([]);
  useEffect(() => {
    supabase.from("sermons").select("id,title,caption,thumbnail_url,media_url,media_type").eq("status", "published").order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => setSermons(data ?? []));
  }, []);

  return (
    <section className="relative section-pad overflow-hidden">
      <BackgroundCarousel images={sermonCarousel} overlayClassName="bg-hero-overlay" />
      <div className="relative mx-auto max-w-6xl px-4 text-white">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Latest Sermons</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold">Be Filled With The Word</h2>
          </div>
          <Link to="/sermons" className="text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {sermons.length === 0 ? (
          <div className="glass-dark rounded-2xl p-10 text-center text-white/80">
            Sermons will appear here once added by the admin.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {sermons.map((s) => {
              const thumb = s.thumbnail_url || (s.media_type === "youtube" ? getYouTubeThumbnail(s.media_url) : null);
              return (
                <Link key={s.id} to="/sermons/$id" params={{ id: s.id }} className="group glass-dark rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform">
                  <div className="aspect-video relative bg-black">
                    {thumb ? <img src={thumb} alt={s.title} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full" />}
                    <div className="absolute inset-0 grid place-items-center bg-black/30 group-hover:bg-black/10 transition">
                      <div className="w-14 h-14 rounded-full grid place-items-center" style={{ background: "var(--gradient-gold)" }}>
                        <Play className="w-6 h-6 text-primary fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
                    {s.caption && <p className="text-sm text-white/70 mt-1 line-clamp-2">{s.caption}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function GalleryPreview() {
  const [items, setItems] = useState<Array<{ id: string; title: string; image_url: string }>>([]);
  useEffect(() => {
    supabase.from("gallery").select("id,title,image_url").eq("status", "published").order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => setItems(data ?? []));
  }, []);

  const display = items.length ? items : galleryCarousel.map((src, i) => ({ id: `seed-${i}`, title: "KMI moment", image_url: src }));

  return (
    <section className="relative section-pad overflow-hidden">
      <BackgroundCarousel images={galleryCarousel} overlayClassName="" />
      <div className="absolute inset-0 bg-background/85" />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Featured Gallery</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold">Moments of Glory</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {display.slice(0, 8).map((item, i) => (
            <Link
              key={item.id}
              to="/gallery"
              className={`group relative overflow-hidden rounded-2xl aspect-square ${i % 5 === 0 ? "md:row-span-2 md:aspect-[1/2]" : ""}`}
            >
              <img src={item.image_url} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/gallery" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-primary text-primary-foreground hover:opacity-90 transition">
            View Full Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function DailyQuote() {
  const [q, setQ] = useState<{ id: string; title: string; caption: string | null; image_url: string | null; created_at: string } | null>(null);
  useEffect(() => {
    supabase.from("daily_quotes").select("id,title,caption,image_url,created_at").eq("status", "published").order("created_at", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => setQ(data));
  }, []);

  return (
    <section className="relative section-pad overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: `url(${g8})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.15 0.08 265 / 0.9), oklch(0.4 0.18 30 / 0.6))" }} />
      <div className="relative mx-auto max-w-3xl px-4 text-center text-white">
        <Quote className="w-12 h-12 mx-auto mb-6 text-gold opacity-80" />
        <div className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Daily Word</div>
        {q ? (
          <>
            <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight mb-6">
              "{q.title}"
            </h2>
            {q.caption && <p className="text-white/85 text-lg italic">{q.caption}</p>}
            <p className="mt-6 text-xs uppercase tracking-widest text-white/60">
              {format(new Date(q.created_at), "MMMM d, yyyy")}
            </p>
          </>
        ) : (
          <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight">
            "Be still, and know that I am God."
            <span className="block text-base mt-4 text-white/70 normal-case tracking-normal">— Psalm 46:10</span>
          </h2>
        )}
      </div>
    </section>
  );
}

function QuickContact() {
  return (
    <section className="section-pad mx-auto max-w-5xl px-4">
      <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
        <div className="text-xs uppercase tracking-[0.25em] text-gold mb-3">Get In Touch</div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Need Prayer? We're Here.</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Reach out to our prayer line, send a message, or join us this Sunday.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <a href="tel:+256755668815" className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-secondary hover:bg-accent transition">
            <Phone className="w-6 h-6 text-primary" />
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Call Us</div>
            <div className="font-medium text-sm">+256 755 668 815</div>
          </a>
          <a href="https://wa.me/256757182981" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-secondary hover:bg-accent transition">
            <MessageCircle className="w-6 h-6 text-primary" />
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Prayer Line</div>
            <div className="font-medium text-sm">+256 757 182 981</div>
          </a>
          <Link to="/contact" className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition">
            <Calendar className="w-6 h-6" />
            <div className="text-xs uppercase tracking-widest opacity-75">Visit Us</div>
            <div className="font-medium text-sm">Plan Your Visit</div>
          </Link>
        </div>
      </div>
    </section>
  );
}
