import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { ArrowRight, Brain, Cpu, Network, Shield, Zap, Users, TrendingUp, Quote, Send } from "lucide-react";

const services = [
  { icon: Cpu, title: "Quantum Computing", desc: "Leveraging quantum processors to solve optimization problems exponentially faster than classical computers." },
  { icon: Brain, title: "AI & Machine Learning", desc: "Custom deep learning models trained on your data to deliver actionable intelligence at scale." },
  { icon: Network, title: "Hybrid Quantum-AI", desc: "Bridging classical AI with quantum acceleration for unprecedented computational breakthroughs." },
];

const stats = [
  { value: "100x", label: "Faster Processing" },
  { value: "50+", label: "Enterprise Clients" },
  { value: "99.9%", label: "Model Accuracy" },
  { value: "15+", label: "Patents Filed" },
];

const testimonials = [
  { name: "Sarah Chen", role: "CTO, BioGenix", quote: "QuantumNest's hybrid system reduced our drug discovery timeline from years to months. Revolutionary." },
  { name: "Marcus Rivera", role: "VP Engineering, FinScale", quote: "Their quantum-enhanced models gave us a decisive edge in risk assessment. Truly next-generation technology." },
  { name: "Dr. Anika Patel", role: "Director of Research, NovaTech", quote: "The team's deep expertise in both quantum computing and AI is unmatched. They delivered beyond our expectations." },
];

const Index = () => {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block font-display text-xs tracking-[0.4em] uppercase text-primary mb-6 animate-fade-in">
            Quantum Computing × Artificial Intelligence
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Engineering the Future with{" "}
            <span className="gradient-text">Quantum Intelligence</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Harnessing the power of quantum computing and AI to solve the world's most complex problems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="lg" asChild>
              <Link to="/services">Explore Solutions <ArrowRight size={18} /></Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/contact">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding border-y border-border/30">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-2">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Our Solutions"
            title="Quantum-Powered Innovation"
            description="We build cutting-edge systems at the intersection of quantum computing and artificial intelligence."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="glass rounded-xl p-8 hover:border-primary/50 transition-all duration-500 group hover:glow-blue">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <s.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-3 text-foreground">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" asChild>
              <Link to="/services">View All Services <ArrowRight size={16} /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-card/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="Why QuantumNest" title="Built on Core Principles" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Innovation", desc: "Pushing the boundaries of what's computationally possible." },
              { icon: Shield, title: "Precision", desc: "Every solution is rigorously validated and optimized." },
              { icon: Users, title: "Ethics", desc: "Responsible AI development guided by transparency." },
              { icon: TrendingUp, title: "Scalability", desc: "From prototype to production at any scale." },
            ].map((v) => (
              <div key={v.title} className="text-center p-6">
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

      {/* Testimonials */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="Testimonials" title="Trusted by Industry Leaders" />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass rounded-xl p-8">
                <Quote size={20} className="text-primary/40 mb-4" />
                <p className="text-foreground/80 text-sm leading-relaxed mb-6">{t.quote}</p>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <SectionHeading
            label="Stay Updated"
            title="Join the Quantum Future"
            description="Get the latest insights on quantum computing and AI delivered to your inbox."
          />
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            <Button variant="hero" size="lg">
              Subscribe <Send size={16} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
