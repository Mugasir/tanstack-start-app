import { createFileRoute, Link } from "@tanstack/react-router";
import { Cross, Heart, Flame, Users, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import banner from "@/assets/photos/kmi-4.jpg";
import hamilo from "@/assets/photos/hamilo.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Kanyinasheema Ministries International" },
      { name: "description", content: "The story, mission, vision and beliefs of Kanyinasheema Ministries International." },
      { property: "og:title", content: "About Kanyinasheema Ministries International" },
      { property: "og:description", content: "Our story, mission, vision and core beliefs." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="relative h-[60svh] min-h-[420px] flex items-end overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${banner})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 text-white">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">About KMI</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold max-w-3xl leading-tight">
            A House Built on <span className="text-gradient-gold">Prayer</span>
          </h1>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-5xl px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-gold mb-3">Our Story</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">From a small gathering to a global movement</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Kanyinasheema Ministries International was birthed out of a hunger for the
              authentic move of God — a place where prayer, prophecy, healing and
              deliverance are not just doctrines but daily realities.
            </p>
            <p>
              Under the leadership of General Hamilo, KMI has grown into a beacon of hope
              for thousands across Uganda and beyond, drawing souls into a deeper walk
              with the Father.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-8">
          <Card icon={Flame} title="Our Mission">
            To raise prayerful, prophetic, Spirit-filled believers who carry healing,
            deliverance and restoration to every nation, family and individual.
          </Card>
          <Card icon={Sparkles} title="Our Vision">
            A generation transformed by encounter with the living God — walking in
            authority, purity and the demonstration of Kingdom power.
          </Card>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Core Beliefs</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold">What We Stand For</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Belief icon={BookOpen} title="The Word">The Bible is the inspired, infallible Word of God.</Belief>
          <Belief icon={Cross} title="Salvation">Salvation is found only through Jesus Christ.</Belief>
          <Belief icon={Flame} title="Holy Spirit">The Holy Spirit empowers, gifts and guides every believer.</Belief>
          <Belief icon={Heart} title="Love">Love is the greatest commandment and the mark of a disciple.</Belief>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="mx-auto max-w-5xl px-4">
          <div className="glass-card rounded-3xl p-6 md:p-12 grid md:grid-cols-[220px_1fr] gap-8 items-center">
            <img src={hamilo} alt="General Hamilo" className="w-44 h-44 md:w-52 md:h-52 rounded-full object-cover mx-auto ring-4 ring-white shadow-elegant" />
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Leadership</div>
              <h3 className="font-display text-3xl font-bold mb-3">General Hamilo</h3>
              <p className="text-muted-foreground mb-4">
                General Overseer — leading KMI in prayer, prophetic ministry, healing and deliverance.
              </p>
              <Link to="/overseer" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                Read full profile <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-5xl px-4">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Worship & Services</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold">Come Worship With Us</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          <ServiceCard day="Sunday" name="Main Service" time="9:00 AM" />
          <ServiceCard day="Wednesday" name="Mid-week Prayer" time="6:30 PM" />
          <ServiceCard day="Friday" name="Deliverance Night" time="7:00 PM" />
        </div>
      </section>
    </>
  );
}

function Card({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="p-8 rounded-3xl bg-card shadow-elegant">
      <div className="w-12 h-12 rounded-xl grid place-items-center mb-5" style={{ background: "var(--gradient-gold)" }}>
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-display text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

function Belief({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card hover:shadow-elegant transition">
      <Icon className="w-8 h-8 text-primary mb-3" />
      <h4 className="font-display text-lg font-semibold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

function ServiceCard({ day, name, time }: { day: string; name: string; time: string }) {
  return (
    <div className="text-center p-6 rounded-2xl bg-card border border-border hover:border-gold transition">
      <div className="text-xs uppercase tracking-widest text-gold mb-2">{day}</div>
      <div className="font-display text-xl font-semibold mb-1">{name}</div>
      <div className="text-muted-foreground text-sm">{time}</div>
    </div>
  );
}
