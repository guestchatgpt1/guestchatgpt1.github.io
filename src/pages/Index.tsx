import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import heroImage from "@/assets/hero-quantum.jpg";
import { ArrowRight, Brain, Cpu, Network, Shield, Zap, Users, TrendingUp, Quote, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

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
  usePageTitle();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast.error("Invalid email", { description: result.error.issues[0].message });
      return;
    }
    setSubscribing(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubscribing(false);
    toast.success("Subscribed!", { description: "You'll receive our latest insights." });
    setEmail("");
  };

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-15" width={1920} height={1080} loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/8 to-secondary/8 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block font-display text-xs tracking-[0.4em] uppercase text-primary mb-6"
          >
            Quantum Computing × Artificial Intelligence
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Engineering the Future with{" "}
            <span className="gradient-text">Quantum Intelligence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
          >
            Harnessing the power of quantum computing and AI to solve the world's most complex problems.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="hero" size="lg" asChild>
              <Link to="/services">Explore Solutions <ArrowRight size={18} /></Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/contact">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding border-y border-border/30" aria-label="Key metrics" id="stats">
        <div className="container-max grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 0.1}>
              <div className="text-center">
                <div className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding" aria-labelledby="solutions-heading">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading
              label="Our Solutions"
              title="Quantum-Powered Innovation"
              description="We build cutting-edge systems at the intersection of quantum computing and artificial intelligence."
            />
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="glass-hover rounded-xl p-8 group h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <s.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-semibold mb-3 text-foreground">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <div className="text-center mt-10">
              <Button variant="outline" asChild>
                <Link to="/services">View All Services <ArrowRight size={16} /></Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-card/30" aria-labelledby="values-heading">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading label="Why QuantumNest" title="Built on Core Principles" />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Innovation", desc: "Pushing the boundaries of what's computationally possible." },
              { icon: Shield, title: "Precision", desc: "Every solution is rigorously validated and optimized." },
              { icon: Users, title: "Ethics", desc: "Responsible AI development guided by transparency." },
              { icon: TrendingUp, title: "Scalability", desc: "From prototype to production at any scale." },
            ].map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.08}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center mx-auto mb-4">
                    <v.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-display text-xs font-semibold mb-2 uppercase tracking-wider">{v.title}</h3>
                  <p className="text-muted-foreground text-sm">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding" aria-labelledby="testimonials-heading">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading label="Testimonials" title="Trusted by Industry Leaders" />
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <blockquote className="glass rounded-xl p-8 h-full flex flex-col">
                  <Quote size={20} className="text-primary/40 mb-4" aria-hidden="true" />
                  <p className="text-foreground/80 text-sm leading-relaxed mb-6 flex-1">{t.quote}</p>
                  <footer>
                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </footer>
                </blockquote>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5" aria-labelledby="newsletter-heading">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <SectionHeading
              label="Stay Updated"
              title="Join the Quantum Future"
              description="Get the latest insights on quantum computing and AI delivered to your inbox."
            />
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                maxLength={255}
                className="flex-1 h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <Button variant="hero" size="lg" type="submit" disabled={subscribing}>
                {subscribing ? "Subscribing..." : <>Subscribe <Send size={16} /></>}
              </Button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
