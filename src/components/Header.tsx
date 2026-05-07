import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

const EVENTS = [
  { to: "/live", label: "Live Stream" },
  { to: "/sermons", label: "Sermons" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <Logo size={44} className="transition-transform group-hover:scale-105" />
          <div className="hidden sm:block leading-tight">
            <div className={`font-display font-bold text-base md:text-lg ${scrolled ? "text-foreground" : "text-white"}`}>
              Kanyinasheema
            </div>
            <div className={`text-[10px] tracking-widest uppercase ${scrolled ? "text-muted-foreground" : "text-white/80"}`}>
              Ministries Int'l
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.slice(0, 3).map((n) => (
            <NavLink key={n.to} to={n.to} scrolled={scrolled}>{n.label}</NavLink>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setEventsOpen(true)}
            onMouseLeave={() => setEventsOpen(false)}
          >
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors ${
                scrolled ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
              }`}
            >
              Events <ChevronDown className="w-4 h-4" />
            </button>
            {eventsOpen && (
              <div className="absolute top-full left-0 pt-2 min-w-[180px]">
                <div className="glass-card rounded-lg p-2 shadow-elegant">
                  {EVENTS.map((e) => (
                    <Link
                      key={e.to}
                      to={e.to}
                      className="block px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      {e.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <NavLink to="/contact" scrolled={scrolled}>Contact</NavLink>
          <Link
            to="/live"
            className="ml-3 px-5 py-2 rounded-full text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
            style={{ background: "var(--gradient-gold)", color: "var(--gold-foreground)" }}
          >
            Join Live
          </Link>
        </nav>

        <button
          className={`lg:hidden p-2 rounded-md ${scrolled ? "text-foreground" : "text-white"}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass-card border-t border-border">
          <div className="px-4 py-4 flex flex-col gap-1">
            {[...NAV.slice(0, 3), ...EVENTS, NAV[3]].map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-foreground hover:bg-accent transition-colors"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/live"
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-3 rounded-full text-center text-sm font-semibold"
              style={{ background: "var(--gradient-gold)", color: "var(--gold-foreground)" }}
            >
              Join Live Service
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, scrolled, children }: { to: string; scrolled: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        scrolled ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
      }`}
      activeProps={{ className: "text-gradient-gold font-semibold" }}
    >
      {children}
    </Link>
  );
}
