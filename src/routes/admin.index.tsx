import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Image as ImageIcon, Video, Quote, Radio, TrendingUp, Plus, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState({ gallery: 0, sermons: 0, quotes: 0, livestream: 0 });
  const [recent, setRecent] = useState<Array<{ kind: string; title: string; created_at: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("gallery").select("title,created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(3),
      supabase.from("sermons").select("title,created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(3),
      supabase.from("daily_quotes").select("title,created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(3),
      supabase.from("livestream").select("title,created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(3),
    ]).then(([g, s, q, l]) => {
      setCounts({ gallery: g.count ?? 0, sermons: s.count ?? 0, quotes: q.count ?? 0, livestream: l.count ?? 0 });
      const all = [
        ...(g.data ?? []).map((d) => ({ kind: "Gallery", ...d })),
        ...(s.data ?? []).map((d) => ({ kind: "Sermon", ...d })),
        ...(q.data ?? []).map((d) => ({ kind: "Quote", ...d })),
        ...(l.data ?? []).map((d) => ({ kind: "Live", ...d })),
      ].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 8);
      setRecent(all);
      setLoading(false);
    });
  }, []);

  const total = counts.gallery + counts.sermons + counts.quotes + counts.livestream;

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Here's what's happening across your ministry.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
          <TrendingUp className="w-4 h-4 text-gold" />
          <span className="font-medium">{total}</span>
          <span className="text-muted-foreground">total items</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={ImageIcon} label="Gallery" value={counts.gallery} to="/admin/gallery" tint="oklch(0.78 0.14 80)" />
        <Stat icon={Video} label="Sermons" value={counts.sermons} to="/admin/sermons" tint="oklch(0.5 0.21 25)" />
        <Stat icon={Quote} label="Daily Quotes" value={counts.quotes} to="/admin/quotes" tint="oklch(0.55 0.18 200)" />
        <Stat icon={Radio} label="Live Streams" value={counts.livestream} to="/admin/livestream" tint="oklch(0.45 0.18 280)" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">Recent activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Latest content added across the site</p>
            </div>
          </div>
          <div className="p-2">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(4)].map((_, i) => <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />)}
              </div>
            ) : recent.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No content yet — start by adding gallery items or sermons.</p>
            ) : (
              <ul>
                {recent.map((r, i) => (
                  <li key={i} className="px-4 py-3 flex items-center justify-between rounded-lg hover:bg-secondary/60 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <KindBadge kind={r.kind} />
                      <span className="font-medium text-sm truncate">{r.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-3">
                      {new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-display text-xl font-bold mb-1">Quick actions</h2>
          <p className="text-xs text-muted-foreground mb-5">Add new content to the site</p>
          <div className="space-y-2">
            <QuickAction to="/admin/gallery" label="Upload to gallery" icon={ImageIcon} />
            <QuickAction to="/admin/sermons" label="Add a sermon" icon={Video} />
            <QuickAction to="/admin/quotes" label="Post daily quote" icon={Quote} />
            <QuickAction to="/admin/livestream" label="Schedule live stream" icon={Radio} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, to, tint }: { icon: React.ElementType; label: string; value: number; to: string; tint: string }) {
  return (
    <Link to={to} className="group bg-card rounded-2xl border border-border p-5 hover:shadow-elegant hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl grid place-items-center" style={{ background: `color-mix(in oklab, ${tint} 15%, transparent)` }}>
          <Icon className="w-5 h-5" style={{ color: tint }} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
      </div>
      <div className="text-3xl font-display font-bold tracking-tight">{value}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
    </Link>
  );
}

function KindBadge({ kind }: { kind: string }) {
  const colors: Record<string, string> = {
    Gallery: "bg-amber-100 text-amber-800",
    Sermon: "bg-rose-100 text-rose-800",
    Quote: "bg-sky-100 text-sky-800",
    Live: "bg-violet-100 text-violet-800",
  };
  return <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded-md ${colors[kind] ?? "bg-muted"}`}>{kind}</span>;
}

function QuickAction({ to, label, icon: Icon }: { to: string; label: string; icon: React.ElementType }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary hover:bg-accent transition group">
      <div className="w-8 h-8 rounded-lg bg-card grid place-items-center border border-border">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm font-medium flex-1">{label}</span>
      <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
    </Link>
  );
}
