import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, Calendar } from "lucide-react";

const posts = [
  {
    category: "Quantum Computing",
    date: "Mar 15, 2026",
    title: "The Road to Fault-Tolerant Quantum Computing: Where Are We Now?",
    excerpt: "An in-depth look at the latest advances in quantum error correction and what they mean for practical quantum advantage.",
  },
  {
    category: "AI Research",
    date: "Mar 8, 2026",
    title: "Beyond Transformers: The Next Architecture for AGI",
    excerpt: "Exploring emerging neural network architectures that could surpass transformer models in reasoning and generalization.",
  },
  {
    category: "Industry Insights",
    date: "Feb 28, 2026",
    title: "Quantum Computing in Finance: A 2026 Market Analysis",
    excerpt: "How financial institutions are deploying quantum algorithms for portfolio optimization, risk modeling, and fraud detection.",
  },
  {
    category: "Quantum Computing",
    date: "Feb 20, 2026",
    title: "Hybrid Quantum-Classical Systems: A Practical Guide",
    excerpt: "Best practices for designing systems that leverage both quantum and classical computing for real-world applications.",
  },
  {
    category: "AI Research",
    date: "Feb 12, 2026",
    title: "Quantum Machine Learning: Separating Hype from Reality",
    excerpt: "A critical analysis of where quantum ML delivers genuine speedups and where classical methods still reign supreme.",
  },
  {
    category: "Industry Insights",
    date: "Feb 5, 2026",
    title: "The Quantum Talent Gap: Building the Workforce of Tomorrow",
    excerpt: "Strategies for organizations looking to build quantum computing capabilities and attract top-tier talent.",
  },
];

const categoryColor: Record<string, string> = {
  "Quantum Computing": "text-primary bg-primary/10",
  "AI Research": "text-secondary bg-secondary/10",
  "Industry Insights": "text-accent bg-accent/10",
};

const Blog = () => {
  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading
              label="Blog & Insights"
              title="Perspectives from the Frontier"
              description="Expert analysis on quantum computing, AI breakthroughs, and their industry impact."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.08}>
                <article className="glass-hover rounded-xl p-6 group cursor-pointer h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor[p.category]}`}>
                      {p.category}
                    </span>
                    <time className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar size={12} aria-hidden="true" />
                      {p.date}
                    </time>
                  </div>
                  <h3 className="font-display text-sm font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{p.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                    Read More <ArrowRight size={14} />
                  </span>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
