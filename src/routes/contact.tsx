import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, MessageCircle, Mail, MapPin, Facebook, Youtube, Music2 } from "lucide-react";
import banner from "@/assets/photos/kmi-9.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Kanyinasheema Ministries International" },
      { name: "description", content: "Reach out to KMI: prayer line, contact form, social platforms." },
      { property: "og:title", content: "Contact KMI" },
      { property: "og:description", content: "Prayer line, phone, email and social platforms." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <section className="relative h-[45svh] min-h-[340px] flex items-end overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${banner})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 text-white">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Get In Touch</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold">We'd Love To Hear From You</h1>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-3xl font-bold mb-6">General Inquiries</h2>
          <div className="space-y-4">
            <Item icon={Phone} label="Phone" value="+256 755 668 815" href="tel:+256755668815" />
            <Item icon={Phone} label="Phone" value="+256 761 487 769" href="tel:+256761487769" />
            <Item icon={MessageCircle} label="WhatsApp Prayer Line" value="+256 757 182 981" href="https://wa.me/256757182981" />
            <Item icon={MapPin} label="Location" value="Kampala, Uganda" />
          </div>

          <div className="glass-card rounded-2xl p-6 mt-8">
            <h3 className="font-display text-xl font-bold mb-3">Prayer Request Guidelines</h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
              <li>Share your full name</li>
              <li>Tell us your current location</li>
              <li>Make your prayer request clear and specific</li>
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="font-display text-xl font-bold mb-4">Connect On Social</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Social icon={Facebook} label="Facebook" value="Kanyinasheema Kmi" />
              <Social icon={Facebook} label="Facebook" value="Ssekadde Elias Kmi" />
              <Social icon={Music2} label="TikTok" value="@hamilo040" href="https://tiktok.com/@hamilo040" />
              <Social icon={Youtube} label="YouTube" value="KMI Channel" />
            </div>
          </div>
        </div>

        <div>
          <ContactForm />
          <div className="mt-8 rounded-2xl overflow-hidden border border-border h-72">
            <iframe
              title="KMI location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=32.55%2C0.30%2C32.65%2C0.36&layer=mapnik"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function Item({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href?: string }) {
  const Tag: any = href ? "a" : "div";
  return (
    <Tag href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
      className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-gold transition">
      <div className="w-11 h-11 rounded-xl grid place-items-center bg-secondary text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </Tag>
  );
}

function Social({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href?: string }) {
  const Tag: any = href ? "a" : "div";
  return (
    <Tag href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-accent transition">
      <Icon className="w-4 h-4 text-primary" />
      <div className="text-sm">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </Tag>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trim & validate basic inputs
    if (!name.trim() || !message.trim()) return;
    const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const url = `https://wa.me/256757182981?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="glass-card rounded-2xl p-6 space-y-4">
      <h3 className="font-display text-2xl font-bold">Send Us A Message</h3>
      <Field label="Full Name">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required
          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:outline-none" />
      </Field>
      <Field label="Email (optional)">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200}
          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:outline-none" />
      </Field>
      <Field label="Message">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} rows={5} required
          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:outline-none resize-none" />
      </Field>
      <button type="submit" className="w-full py-3 rounded-full font-semibold text-primary-foreground bg-primary hover:opacity-90 transition">
        {sent ? "Sent! Opening WhatsApp…" : "Send via WhatsApp"}
      </button>
      <p className="text-xs text-muted-foreground text-center">Your message opens in WhatsApp on the prayer line.</p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
