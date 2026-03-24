import SectionHeading from "@/components/SectionHeading";
import { Target, Eye, Lightbulb, Shield, Users, TrendingUp } from "lucide-react";

const values = [
  { icon: Lightbulb, title: "Innovation", desc: "We relentlessly pursue breakthroughs at the frontier of quantum and AI." },
  { icon: Target, title: "Precision", desc: "Every algorithm, every model—rigorously tested and optimized for accuracy." },
  { icon: Shield, title: "Ethics", desc: "We build responsible technology with transparency and accountability at its core." },
  { icon: TrendingUp, title: "Scalability", desc: "Solutions architected to grow from proof-of-concept to enterprise scale." },
];

const timeline = [
  { year: "2021", title: "Founded", desc: "QuantumNest AI was born from a shared vision between quantum physicists and AI researchers." },
  { year: "2022", title: "First Quantum-AI Hybrid", desc: "Launched our first hybrid quantum-classical system for pharmaceutical research." },
  { year: "2023", title: "Enterprise Expansion", desc: "Scaled to 50+ enterprise clients across finance, healthcare, and logistics." },
  { year: "2024", title: "Research Breakthrough", desc: "Published groundbreaking research on quantum error correction for ML workloads." },
  { year: "2025", title: "Global Presence", desc: "Expanded operations to Europe and Asia-Pacific with new research labs." },
];

const About = () => {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="About Us"
            title="Bridging Quantum Computing & AI Innovation"
            description="We are a team of quantum physicists, AI researchers, and engineers united by a single mission: to unlock the full potential of quantum intelligence for real-world impact."
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-card/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="glass rounded-xl p-10">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Target size={24} className="text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-4 text-foreground">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To democratize quantum-enhanced AI, making it accessible to organizations solving humanity's greatest challenges—from drug discovery to climate modeling to financial stability.
            </p>
          </div>
          <div className="glass rounded-xl p-10">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6">
              <Eye size={24} className="text-secondary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-4 text-foreground">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              A world where the convergence of quantum computing and artificial intelligence redefines what's computationally possible—enabling discoveries that were once beyond imagination.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <SectionHeading label="Our Journey" title="From Vision to Reality" />
          <div className="space-y-8">
            {timeline.map((t, i) => (
              <div key={t.year} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                    <span className="font-display text-xs font-bold text-foreground">{t.year.slice(2)}</span>
                  </div>
                  {i < timeline.length - 1 && <div className="w-px h-full bg-border/50 mt-2" />}
                </div>
                <div className="pb-8">
                  <div className="font-display text-xs text-primary tracking-wider mb-1">{t.year}</div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-card/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="Core Values" title="What Drives Us" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="glass rounded-xl p-8 text-center hover:border-primary/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-sm font-semibold mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="Leadership" title="Meet the Minds Behind QuantumNest" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Dr. Elena Vasquez", role: "CEO & Co-Founder", bg: "from-primary/20 to-accent/20" },
              { name: "Dr. James Nakamura", role: "CTO & Co-Founder", bg: "from-secondary/20 to-primary/20" },
              { name: "Dr. Priya Sharma", role: "Head of Research", bg: "from-accent/20 to-secondary/20" },
            ].map((m) => (
              <div key={m.name} className="glass rounded-xl p-8 text-center">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${m.bg} flex items-center justify-center mx-auto mb-4`}>
                  <Users size={32} className="text-primary/60" />
                </div>
                <h3 className="font-semibold text-foreground">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
