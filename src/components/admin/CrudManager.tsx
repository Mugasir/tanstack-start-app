import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { detectMediaType } from "@/lib/media";

type FieldKind = "text" | "textarea" | "image" | "media" | "switch";
export interface FieldDef {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
}

interface Props {
  table: "gallery" | "sermons" | "daily_quotes" | "livestream";
  title: string;
  fields: FieldDef[];
  displayKey?: string; // which field to show as title
  imageKey?: string; // which field renders as thumbnail
}

export function CrudManager({ table, title, fields, displayKey = "title", imageKey }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [table]);

  const remove = async (id: string) => {
    if (!confirm("Delete this item permanently?")) return;
    await supabase.from(table).delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{items.length} item{items.length === 1 ? "" : "s"}</p>
        </div>
        <button onClick={() => setEditing({})}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="bg-card rounded-2xl p-10 text-center text-muted-foreground border border-border">
          No items yet. Click <strong>New</strong> to create your first one.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-elegant transition">
              {imageKey && item[imageKey] && (
                <div className="aspect-video bg-secondary">
                  <img src={item[imageKey]} alt="" loading="lazy" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold line-clamp-1">{item[displayKey]}</h3>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${item.status === "published" ? "bg-gold/20 text-gold-foreground" : "bg-muted text-muted-foreground"}`}>
                    {item.status}
                  </span>
                </div>
                {item.caption && <p className="text-xs text-muted-foreground line-clamp-2">{item.caption}</p>}
                <p className="text-[10px] text-muted-foreground/70 mt-2">{format(new Date(item.created_at), "PP")}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setEditing(item)} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-secondary hover:bg-accent transition">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => remove(item.id)} className="px-3 py-1.5 text-xs rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditDialog
          table={table}
          fields={fields}
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function EditDialog({ table, fields, initial, onClose, onSaved }: {
  table: string; fields: FieldDef[]; initial: any; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState<any>(() => ({ status: "published", ...initial }));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const upload = async (key: string, file: File) => {
    setUploading(key);
    const path = `${table}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
    if (error) { alert(error.message); setUploading(null); return; }
    const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
    set(key, pub.publicUrl);
    setUploading(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload: any = { ...form };
    delete payload.id; delete payload.created_at; delete payload.updated_at;
    if (table === "sermons" && payload.media_url) {
      payload.media_type = detectMediaType(payload.media_url);
    }
    const op = initial.id
      ? supabase.from(table as any).update(payload).eq("id", initial.id)
      : supabase.from(table as any).insert(payload);
    const { error } = await op;
    setBusy(false);
    if (error) { alert(error.message); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 grid place-items-center p-4 overflow-auto" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-card rounded-2xl shadow-elegant my-8 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card">
          <h2 className="font-display text-xl font-bold">{initial.id ? "Edit" : "New"} item</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 grid place-items-center rounded-full hover:bg-accent"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">{f.label}{f.required && " *"}</label>
              {f.kind === "text" && (
                <input value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} required={f.required} maxLength={300}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-gold focus:outline-none" />
              )}
              {f.kind === "textarea" && (
                <textarea value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} rows={4} maxLength={5000}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-gold focus:outline-none resize-none" />
              )}
              {f.kind === "image" && (
                <div className="space-y-2">
                  {form[f.key] && <img src={form[f.key]} alt="" className="w-full max-h-48 object-cover rounded-xl" />}
                  <div className="flex gap-2">
                    <input value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} placeholder="Paste image URL or upload"
                      className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm focus:border-gold focus:outline-none" />
                    <label className="px-3 py-2 rounded-xl bg-secondary hover:bg-accent cursor-pointer text-sm inline-flex items-center gap-1">
                      {uploading === f.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Upload
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(f.key, file); }} />
                    </label>
                  </div>
                </div>
              )}
              {f.kind === "media" && (
                <div className="space-y-2">
                  <input value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} required={f.required}
                    placeholder="Paste YouTube / TikTok link, or upload below"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:border-gold focus:outline-none" />
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary hover:bg-accent cursor-pointer text-xs">
                    {uploading === f.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload video file
                    <input type="file" accept="video/*" className="hidden"
                      onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(f.key, file); }} />
                  </label>
                </div>
              )}
              {f.kind === "switch" && (
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!form[f.key]} onChange={(e) => set(f.key, e.target.checked)} className="w-5 h-5 accent-primary" />
                  <span className="text-sm">{form[f.key] ? "Yes" : "No"}</span>
                </label>
              )}
            </div>
          ))}
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Status</label>
            <select value={form.status ?? "published"} onChange={(e) => set("status", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-gold focus:outline-none">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div className="p-5 border-t border-border sticky bottom-0 bg-card flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-full bg-secondary hover:bg-accent text-sm">Cancel</button>
          <button type="submit" disabled={busy} className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
