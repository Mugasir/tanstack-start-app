import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => setData(data));
  }, []);

  if (!data) return <div className="grid place-items-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  const set = (k: string, v: string) => setData((d: any) => ({ ...d, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { id, created_at, updated_at, ...payload } = data;
    const { error } = await supabase.from("site_settings").update(payload).eq("id", 1);
    setBusy(false);
    if (error) return alert(error.message);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    ["church_name", "Church name"], ["tagline", "Tagline"],
    ["contact_phone_1", "Phone 1"], ["contact_phone_2", "Phone 2"],
    ["whatsapp", "WhatsApp prayer line"], ["address", "Address"],
    ["facebook", "Facebook"], ["tiktok", "TikTok"],
    ["youtube", "YouTube"], ["twitter", "X (Twitter)"],
  ];

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4">
      <div className="mb-4">
        <h1 className="font-display text-3xl font-bold">Site Settings</h1>
        <p className="text-sm text-muted-foreground">Update church-wide info and contact details.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map(([k, label]) => (
          <label key={k} className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">{label}</span>
            <input value={data[k] ?? ""} onChange={(e) => set(k, e.target.value)} maxLength={300}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-gold focus:outline-none" />
          </label>
        ))}
      </div>
      <button type="submit" disabled={busy}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50">
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
        {saved ? "Saved!" : "Save changes"}
      </button>
    </form>
  );
}
