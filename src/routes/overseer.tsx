import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import hamilo from "@/assets/photos/hamilo.jpg";
import banner from "@/assets/photos/kmi-2.jpg";

export const Route = createFileRoute("/overseer")({
  head: () => ({
    meta: [
      { title: "General Hamilo — General Overseer of KMI" },
      { name: "description", content: "The biography, ministry journey, vision and impact of General Hamilo, General Overseer of Kanyinasheema Ministries International." },
      { property: "og:title", content: "General Hamilo — General Overseer" },
      { property: "og:description", content: "Biography, ministry journey, vision and impact." },
    ],
  }),
  component: Overseer,
});

function Overseer() {
  return (
    <>
      <section className="relative h-[55svh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${banner})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto max-w-5xl px-4 pb-12 text-white">
          <Link to="/about" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to About
          </Link>
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">General Overseer</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold">General Hamilo</h1>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-4xl px-4">
        <div className="glass-card rounded-3xl p-6 md:p-10 -mt-32 relative z-10">
          <img src={hamilo} alt="General Hamilo" className="w-40 h-40 rounded-full object-cover mx-auto ring-4 ring-white shadow-elegant -mt-28 mb-4" />
          <div className="text-center mb-8">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">General Overseer</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">General Hamilo</h2>
            <p className="text-sm text-muted-foreground mt-2">Founder • Kanyinasheema Ministries International</p>
          </div>
          <div className="prose prose-lg max-w-none text-foreground">
            <Section title="Biography">
              General Hamilo is the visionary founder and General Overseer of Kanyinasheema
              Ministries International. Called from a young age into the prophetic and
              healing ministry, he has dedicated his life to seeing the Kingdom of God
              advance through prayer, the spoken Word, and demonstrations of the Spirit.
            </Section>

            <Section title="Ministry Journey">
              From humble beginnings of small home prayer meetings to leading large
              gatherings and crusades across Uganda, his ministry has been marked by
              genuine encounters with God, lives transformed, captives set free, and
              the sick healed by the power of Jesus Christ.
            </Section>

            <Section title="Vision">
              To raise an army of Spirit-filled believers who walk in spiritual authority,
              prophetic clarity and healing power — a generation that will reshape
              families, nations and generations through the Gospel.
            </Section>

            <Section title="Impact">
              Thousands have come to Christ, been delivered from bondage, healed from
              sicknesses and restored in their families through the ministry of KMI
              under General Hamilo's leadership. The work continues to expand to
              every nation God sends us.
            </Section>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 text-gradient-gold">{title}</h2>
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
