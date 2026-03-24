import SectionHeading from "@/components/SectionHeading";
import { Atom, BrainCircuit, Gauge, Workflow } from "lucide-react";

const technologies = [
  {
    icon: Atom,
    title: "Quantum Algorithms",
    desc: "From Shor's and Grover's to proprietary variational algorithms, we design quantum circuits optimized for real-world problems.",
    details: ["Variational Quantum Eigensolver (VQE)", "Quantum Approximate Optimization (QAOA)", "Quantum Monte Carlo methods", "Custom error mitigation strategies"],
  },
  {
    icon: BrainCircuit,
    title: "Neural Networks",
    desc: "State-of-the-art deep learning architectures including transformers, graph neural networks, and quantum-classical hybrid models.",
    details: ["Transformer architectures", "Graph Neural Networks", "Quantum neural networks", "Federated learning systems"],
  },
  {
    icon: Gauge,
    title: "Optimization Systems",
    desc: "Solving combinatorial and continuous optimization problems that are intractable for classical methods.",
    details: ["Combinatorial optimization", "Portfolio optimization", "Supply chain optimization", "Real-time scheduling"],
  },
  {
    icon: Workflow,
    title: "Hybrid Pipelines",
    desc: "Seamlessly orchestrating quantum and classical resources for maximum computational advantage.",
    details: ["Quantum-classical middleware", "Auto-scaling infrastructure", "Real-time monitoring", "Benchmark analytics"],
  },
];

const Technology = () => {
  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Technology"
            title="The Science Behind Our Solutions"
            description="Deep expertise in quantum computing, AI, and the hybrid systems that connect them."
          />

          <div className="grid md:grid-cols-2 gap-8">
            {technologies.map((t) => (
              <div key={t.title} className="glass rounded-xl p-8 hover:border-primary/50 transition-all duration-500 group">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
                    <t.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">{t.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
                <div className="space-y-2 ml-16">
                  {t.details.map((d) => (
                    <div key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Architecture Diagram Placeholder */}
          <div className="mt-20">
            <SectionHeading label="Architecture" title="How It All Connects" />
            <div className="glass rounded-xl p-12 text-center">
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                {["Data Ingestion", "Classical Pre-Processing", "Quantum Circuit Execution", "Hybrid Optimization", "Model Training", "Deployment & Monitoring"].map((step, i) => (
                  <div key={step} className="relative">
                    <div className="bg-muted rounded-lg p-4 border border-border/50 hover:border-primary/50 transition-colors">
                      <div className="font-display text-xs text-primary mb-1">0{i + 1}</div>
                      <div className="text-xs text-foreground font-medium">{step}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Technology;
