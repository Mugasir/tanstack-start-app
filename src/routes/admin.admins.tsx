import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Shield, X } from "lucide-react";
import { format } from "date-fns";
import { listAdmins, createAdmin, removeAdmin } from "@/server/admins.functions";
import { supabase } from "@/integrations/supabase/client";

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const Route = createFileRoute("/admin/admins")({
  component: AdminsPage,
});

type Admin = { id: string; email: string; name: string; created_at: string };

function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res: any = await listAdmins({ headers: await authHeaders() } as any);
      if (res?.ok) {
        setAdmins(res.admins ?? []);
      } else {
        setAdmins([]);
        setLoadError(res?.error ?? "Failed to load admins");
      }
    } catch (e: any) {
      setAdmins([]);
      setLoadError(e?.message ?? "Failed to load admins");
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Remove this administrator? Their account will be deleted.")) return;
    try {
      const res: any = await removeAdmin({ data: { userId: id }, headers: await authHeaders() } as any);
      if (!res?.ok) throw new Error(res?.error ?? "Failed");
      load();
    } catch (e: any) {
      alert(e.message ?? "Failed to remove");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Administrators</h1>
          <p className="text-sm text-muted-foreground">{admins.length} admin{admins.length === 1 ? "" : "s"} can manage this site</p>
        </div>
        <button onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Admin
        </button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : loadError ? (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-2xl p-6 text-sm space-y-2">
          <strong className="block">Couldn't load admins</strong>
          <p>{loadError}</p>
          {loadError.includes("SUPABASE_SERVICE_ROLE_KEY") && (
            <p className="text-foreground/80 mt-2">
              This feature uses a privileged server key that is only available in the published site.
              Open your <strong>published URL</strong> (top-right "Publish" button), log in there, and
              this page will work. It will not work inside the in-editor preview.
            </p>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4 hidden md:table-cell">Added</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.map((a) => (
                <tr key={a.id} className="hover:bg-secondary/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full grid place-items-center" style={{ background: "var(--gradient-gold)" }}>
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{a.name || "—"}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{a.email}</td>
                  <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{format(new Date(a.created_at), "PP")}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => remove(a.id)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && <NewAdminDialog onClose={() => setOpen(false)} onSaved={() => { setOpen(false); load(); }} />}
    </div>
  );
}

function NewAdminDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const res: any = await createAdmin({ data: form, headers: await authHeaders() } as any);
      if (!res?.ok) throw new Error(res?.error ?? "Failed to create admin");
      onSaved();
    } catch (e: any) {
      setErr(e.message ?? "Failed to create admin");
    }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 grid place-items-center p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-2xl shadow-elegant">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-xl font-bold">Add Administrator</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 grid place-items-center rounded-full hover:bg-accent"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required maxLength={120} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required maxLength={200} />
          <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required minLength={8} />
          <p className="text-xs text-muted-foreground">Password must be at least 8 characters.</p>
          {err && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{err}</div>}
        </div>
        <div className="p-5 border-t border-border flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-full bg-secondary hover:bg-accent text-sm">Cancel</button>
          <button type="submit" disabled={busy} className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Admin
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, maxLength, minLength }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
  required?: boolean; maxLength?: number; minLength?: number;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">{label}{required && " *"}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        required={required} maxLength={maxLength} minLength={minLength}
        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-gold focus:outline-none" />
    </div>
  );
}
