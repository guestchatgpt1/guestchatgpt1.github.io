import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, Calendar, Clock, ExternalLink, Loader2, RefreshCw, Linkedin } from "lucide-react";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogPosts";
import { useSheetArticles } from "@/hooks/useSheetArticles";

const categoryColor: Record<string, string> = {
  "Quantum Computing": "text-primary bg-primary/10",
  "AI Research": "text-secondary bg-secondary/10",
  "Industry Insights": "text-accent bg-accent/10",
};

const Blog = () => {
  const { articles, loading, error, reload } = useSheetArticles();

  return (
    <div className="pt-16">
      <Seo
        title="Articles & Insights"
        description="Expert analysis on quantum computing, AI breakthroughs, fault-tolerant qubits, and their real-world industry impact from QuantumAI Lab researchers."
      />
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading
              as="h1"
              label="Articles & Insights"
              title="Perspectives from the Frontier"
              description="Expert analysis on quantum computing, AI breakthroughs, and their industry impact."
            />
          </AnimatedSection>

          {/* Published articles, sourced live from our editorial sheet */}
          <AnimatedSection>
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                Latest Articles
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={reload} disabled={loading}>
                {loading ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <RefreshCw size={14} aria-hidden="true" />}
                Refresh
              </Button>
            </div>
          </AnimatedSection>

          <div aria-live="polite" aria-atomic="false">
            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass rounded-xl p-6 h-40 animate-pulse" aria-hidden="true" />
                ))}
                <span className="sr-only">Loading articles…</span>
              </div>
            )}

            {!loading && error && (
              <div className="glass rounded-xl p-8 text-center mb-16" role="alert">
                <p className="text-sm text-muted-foreground mb-4">
                  We couldn't load the latest articles right now ({error}).
                </p>
                <Button variant="outline" size="sm" onClick={reload}>
                  <RefreshCw size={14} aria-hidden="true" /> Try again
                </Button>
              </div>
            )}

            {!loading && !error && articles.length === 0 && (
              <div className="glass rounded-xl p-8 text-center mb-16">
                <p className="text-sm text-muted-foreground">No articles published yet — check back soon.</p>
              </div>
            )}

            {!loading && !error && articles.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                {articles.map((a, i) => (
                  <AnimatedSection key={a.urn || `${a.title}-${i}`} delay={Math.min(i, 6) * 0.06}>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-hover rounded-xl p-6 group h-full flex flex-col focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
                      aria-label={`Read on LinkedIn: ${a.title}`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full text-primary bg-primary/10 truncate">
                          {a.category || a.topic || "Article"}
                        </span>
                        <time
                          dateTime={a.isoDate ?? undefined}
                          className="flex items-center gap-1 text-xs text-muted-foreground shrink-0"
                        >
                          <Calendar size={12} aria-hidden="true" />
                          {a.date}
                        </time>
                      </div>
                      <h3 className="font-display text-sm font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                        {a.title}
                      </h3>
                      {a.summary && (
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-4">
                          {a.summary}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mt-auto group-hover:gap-2.5 transition-all">
                        <Linkedin size={14} aria-hidden="true" /> Read on LinkedIn
                        <ExternalLink size={12} aria-hidden="true" />
                      </span>
                    </a>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>

          {/* Long-form posts hosted on this site */}
          <AnimatedSection>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-6">
              In-Depth Blog Posts
            </h2>
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
                      <span className="sr-only">Read full article: {p.title}</span>
                      <span aria-hidden="true">Read full article</span> <ArrowRight size={14} aria-hidden="true" />
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
