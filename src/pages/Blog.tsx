import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Seo from "@/components/Seo";
import { blogPosts } from "@/data/blogPosts";

const categoryColor: Record<string, string> = {
  "Quantum Computing": "text-primary bg-primary/10",
  "AI Research": "text-secondary bg-secondary/10",
  "Industry Insights": "text-accent bg-accent/10",
};

const Blog = () => {
  return (
    <div className="pt-16">
      <Seo
        title="Blog & Insights"
        description="Expert analysis on quantum computing, AI breakthroughs, fault-tolerant qubits, and their real-world industry impact from QuantumAI Lab researchers."
      />
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading
              as="h1"
              label="Blog & Insights"
              title="Perspectives from the Frontier"
              description="Expert analysis on quantum computing, AI breakthroughs, and their industry impact."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((p, i) => (
              <AnimatedSection key={p.slug} delay={i * 0.08}>
                <Link
                  to={`/blog/${p.slug}`}
                  className="glass-hover rounded-xl p-6 group h-full flex flex-col focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
                  aria-label={`Read article: ${p.title}`}
                >
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
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                      Read More <ArrowRight size={14} />
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} aria-hidden="true" />
                      {p.readTime}
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
