import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cpu, Brain, Network, FlaskConical, Building2, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Cpu,
    title: "Quantum Computing Solutions",
    desc: "Custom quantum algorithms designed for optimization, simulation, and cryptography. We leverage superconducting qubits and trapped-ion systems to deliver solutions classical computers can't match.",
    features: ["Quantum circuit design", "Error correction", "Quantum annealing", "Custom qubit architectures"],
  },
  {
    icon: Brain,
    title: "AI & Machine Learning Development",
    desc: "End-to-end AI solutions from data strategy to production deployment. Our models are built for accuracy, interpretability, and scale.",
    features: ["Deep learning models", "NLP & computer vision", "Reinforcement learning", "MLOps & deployment"],
  },
  {
    icon: Network,
    title: "Hybrid Quantum-AI Systems",
    desc: "The best of both worlds—combining quantum speedups with classical AI for unprecedented performance on complex tasks.",
    features: ["Variational quantum circuits", "Quantum-enhanced optimization", "Hybrid training pipelines", "Performance benchmarking"],
  },
  {
    icon: FlaskConical,
    title: "Research & Consulting",
    desc: "Deep technical expertise to guide your quantum and AI strategy. From feasibility studies to roadmap development.",
    features: ["Technology assessment", "Proof of concept", "Research partnerships", "Talent development"],
  },
  {
    icon: Building2,
    title: "Enterprise Solutions",
    desc: "Production-grade quantum-AI platforms tailored for enterprise scale, security, and compliance requirements.",
    features: ["Cloud integration", "Enterprise security", "Regulatory compliance", "24/7 support"],
  },
];

const Services = () => {
  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading
              label="Services"
              title="Solutions That Redefine Possible"
              description="From pure quantum computing to enterprise AI, we deliver technology that transforms industries."
            />
          </AnimatedSection>

          <div className="space-y-8">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.08}>
                <div className={`glass-hover rounded-xl p-8 md:p-10 ${i % 2 === 1 ? "md:ml-12" : "md:mr-12"}`}>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center">
                        <s.icon size={32} className="text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-base font-bold text-foreground mb-3">{s.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {s.features.map((f) => (
                          <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="text-center mt-16">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Start Your Project <ArrowRight size={18} /></Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Services;
