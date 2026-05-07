import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { Logo } from "@/components/Logo";
import { bootstrapAdmin } from "@/server/bootstrap.functions";
import loginBg from "@/assets/photos/kmi-5.jpg";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — KMI" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Login,
});

function Login() {
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Bootstrap the seeded super-admin on first load
  useEffect(() => {
    bootstrapAdmin().catch(() => {});
  }, []);

  useEffect(() => {
    if (user && isAdmin) navigate({ to: "/admin" });
  }, [user, isAdmin, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) setError(error);
  };

  return (
    <div className="min-h-screen relative grid place-items-center px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, oklch(0.13 0.06 265 / 0.85), oklch(0.22 0.1 265 / 0.75))" }} />
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 20% 30%, var(--gold) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--crimson) 0%, transparent 40%)" }} />

      <Link to="/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to site
      </Link>

      <div className="relative w-full max-w-md glass-card rounded-3xl p-8 shadow-elegant">
        <div className="flex flex-col items-center mb-6">
          <Logo size={70} />
          <h1 className="font-display text-2xl font-bold mt-3 text-center">Kanyinasheema Ministries</h1>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">Admin Portal</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200}
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-background border border-border focus:border-gold focus:outline-none" />
              <button type="button" onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{error}</div>}
          <button type="submit" disabled={busy}
            className="w-full py-3 rounded-full font-semibold text-primary-foreground bg-primary hover:opacity-90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
