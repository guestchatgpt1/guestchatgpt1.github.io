import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Seo from "@/components/Seo";
import { blogPosts, getPostBySlug } from "@/data/blogPosts";

const categoryColor: Record<string, string> = {
  "Quantum Computing": "text-primary bg-primary/10",
  "AI Research": "text-secondary bg-secondary/10",
  "Industry Insights": "text-accent bg-accent/10",
};

const BlogPost = () => {
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: post.cover,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "QuantumAI Lab",
    },
    articleSection: post.category,
  };

  return (
    <article className="pt-16">
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        ogType="article"
        image={post.cover}
        jsonLd={articleJsonLd}
      />
      <section className="section-padding pb-0">
        <div className="container-max max-w-4xl">
          <AnimatedSection>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={14} aria-hidden="true" /> Back to all articles
            </Link>

            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-5 ${categoryColor[post.category]}`}>
              {post.category}
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground border-y border-border/40 py-4 mb-10">
              <span className="inline-flex items-center gap-2">
                <User size={14} aria-hidden="true" />
                <span className="text-foreground font-medium">{post.author.name}</span>
                <span className="text-muted-foreground">· {post.author.role}</span>
              </span>
              <time className="inline-flex items-center gap-1.5">
                <Calendar size={14} aria-hidden="true" /> {post.date}
              </time>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} aria-hidden="true" /> {post.readTime}
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden mb-12 border border-border/40">
              <img
                src={post.cover}
                alt=""
                className="w-full h-[280px] sm:h-[420px] object-cover"
                loading="eager"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="prose-article space-y-6 text-foreground/90">
              {post.content.map((block, i) => {
                if (block.type === "h2")
                  return (
                    <h2 key={i} className="font-display text-2xl font-semibold text-foreground mt-10 mb-2">
                      {block.text}
                    </h2>
                  );
                if (block.type === "h3")
                  return (
                    <h3 key={i} className="font-display text-xl font-semibold text-foreground mt-6">
                      {block.text}
                    </h3>
                  );
                if (block.type === "quote")
                  return (
                    <blockquote
                      key={i}
                      className="border-l-4 border-primary/60 bg-primary/5 pl-5 py-4 rounded-r-lg italic text-foreground/90"
                    >
                      {block.text}
                    </blockquote>
                  );
                if (block.type === "list")
                  return (
                    <ul key={i} className="list-disc pl-6 space-y-2 text-muted-foreground">
                      {block.items?.map((it, j) => (
                        <li key={j}>{it}</li>
                      ))}
                    </ul>
                  );
                return (
                  <p key={i} className="text-muted-foreground leading-relaxed text-base">
                    {block.text}
                  </p>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max max-w-6xl">
          <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Continue reading
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="glass-hover rounded-xl p-6 group flex flex-col focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <span className={`self-start text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${categoryColor[p.category]}`}>
                  {p.category}
                </span>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">{p.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                  Read article <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
};

export default BlogPost;
