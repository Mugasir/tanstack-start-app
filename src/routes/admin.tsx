import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard, Image as ImageIcon, Video, Quote, Radio, Settings, LogOut, Loader2, Shield,
} from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — KMI" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: React.ElementType; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/sermons", label: "Sermons", icon: Video },
  { to: "/admin/quotes", label: "Daily Quotes", icon: Quote },
  { to: "/admin/livestream", label: "Live Stream", icon: Radio },
  { to: "/admin/admins", label: "Admins", icon: Shield },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
];

function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!user || !isAdmin) {
      if (path !== "/admin/login") navigate({ to: "/admin/login" });
    }
  }, [user, isAdmin, loading, navigate, path]);

  // login page renders without the admin shell
  if (path === "/admin/login") return <Outlet />;

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-secondary">
      <aside className="w-64 hidden md:flex flex-col bg-primary text-primary-foreground">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <Logo size={36} />
          <div>
            <div className="font-display font-bold text-sm">KMI Admin</div>
            <div className="text-[10px] uppercase tracking-widest text-primary-foreground/60">Control Panel</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link key={n.to} to={n.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active ? "bg-white/15 text-white font-medium" : "text-primary-foreground/75 hover:bg-white/5"
                }`}>
                <Icon className="w-4 h-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={() => { signOut(); navigate({ to: "/admin/login" }); }}
          className="m-3 px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm text-primary-foreground/80 hover:bg-white/10 transition">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 bg-primary text-primary-foreground">
          <div className="flex items-center gap-2"><Logo size={28} /><span className="font-display font-bold">KMI Admin</span></div>
          <button onClick={() => { signOut(); navigate({ to: "/admin/login" }); }} className="p-2"><LogOut className="w-5 h-5" /></button>
        </header>
        <nav className="md:hidden flex overflow-x-auto gap-1 px-3 py-2 bg-primary/95 text-primary-foreground border-t border-white/10">
          {NAV.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs ${active ? "bg-white text-primary font-semibold" : "bg-white/10"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 p-4 md:p-8 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
}
