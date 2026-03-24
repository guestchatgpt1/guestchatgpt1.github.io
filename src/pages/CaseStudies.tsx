import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical, TrendingUp, Truck } from "lucide-react";

const cases = [
  {
    icon: FlaskConical,
    title: "Drug Discovery Optimization",
    client: "Global pharmaceutical company",
    challenge: "Screening billions of molecular combinations for a novel cancer therapy was taking years with classical methods.",
    solution: "Deployed a hybrid quantum-AI molecular simulation engine to evaluate candidate compounds 100x faster.",
    results: [
      { metric: "100x", label: "Faster screening" },
      { metric: "3", label: "Lead compounds identified" },
      { metric: "18mo", label: "Time to clinical trials (vs. 5yr)" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Financial Risk Modeling",
    client: "Top-tier investment bank",
    challenge: "Portfolio risk assessment models couldn't process complex derivative structures in real-time market conditions.",
    solution: "Built quantum-enhanced Monte Carlo simulations for real-time risk calculations across multi-asset portfolios.",
    results: [
      { metric: "50x", label: "Faster risk computation" },
      { metric: "99.7%", label: "Model accuracy" },
      { metric: "$2B+", label: "Assets optimized" },
    ],
  },
  {
    icon: Truck,
    title: "Logistics Optimization",
    client: "Fortune 500 logistics provider",
    challenge: "Routing 10,000+ daily shipments across a global network with real-time constraints was computationally intractable.",
    solution: "Quantum-classical hybrid optimizer that finds near-optimal routes in seconds, adapting to live traffic and weather data.",
    results: [
      { metric: "23%", label: "Cost reduction" },
      { metric: "40%", label: "Faster delivery" },
      { metric: "15K tons", label: "CO₂ saved annually" },
    ],
  },
];

const CaseStudies = () => {
  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Case Studies"
            title="Real-World Quantum Impact"
            description="How QuantumNest AI is delivering measurable results across industries."
          />

          <div className="space-y-12">
            {cases.map((c) => (
              <div key={c.title} className="glass rounded-xl overflow-hidden">
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <c.icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">{c.title}</h3>
                      <p className="text-sm text-muted-foreground">{c.client}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-display text-xs tracking-wider text-primary uppercase mb-2">Challenge</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{c.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-display text-xs tracking-wider text-secondary uppercase mb-2">Solution</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{c.solution}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-6 bg-muted/50 rounded-lg">
                    {c.results.map((r) => (
                      <div key={r.label} className="text-center">
                        <div className="font-display text-2xl font-bold gradient-text">{r.metric}</div>
                        <div className="text-xs text-muted-foreground mt-1">{r.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Start Your Project <ArrowRight size={18} /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;
