import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Phone, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative bg-primary text-primary-foreground">
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle at 20% 0%, var(--gold) 0%, transparent 50%)" }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Logo size={52} />
            <div>
              <div className="font-display text-xl font-bold">Kanyinasheema</div>
              <div className="text-xs uppercase tracking-widest text-primary-foreground/70">Ministries International</div>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/80 max-w-md leading-relaxed">
            Leading souls into prayer, prophetic ministry, healing and deliverance —
            with a heart for restoration and spiritual transformation.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://wa.me/256757182981" target="_blank" rel="noreferrer"
              className="w-10 h-10 rounded-full glass-dark grid place-items-center hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass-dark grid place-items-center hover:scale-110 transition-transform">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass-dark grid place-items-center hover:scale-110 transition-transform">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-gradient-gold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/about" className="hover:text-gradient-gold transition-colors">About</Link></li>
            <li><Link to="/gallery" className="hover:text-gradient-gold transition-colors">Gallery</Link></li>
            <li><Link to="/sermons" className="hover:text-gradient-gold transition-colors">Sermons</Link></li>
            <li><Link to="/live" className="hover:text-gradient-gold transition-colors">Live Stream</Link></li>
            <li><Link to="/contact" className="hover:text-gradient-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-gradient-gold">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +256 755 668 815</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +256 761 487 769</li>
            <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> +256 757 182 981</li>
            <li className="text-xs text-primary-foreground/60 pt-2">Kampala, Uganda</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} Kanyinasheema Ministries International. All rights reserved.
      </div>
    </footer>
  );
}
