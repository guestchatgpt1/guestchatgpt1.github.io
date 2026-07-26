import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { blogPosts } from "../../../data/blogPosts";
import { SITE_URL } from "../content";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List QuantumAI Lab blog articles with slug, title, category, date, read time, excerpt and URL. Optionally filter by category or a search term.",
  inputSchema: {
    category: z.string().describe("Optional category filter, matched case-insensitively.").optional(),
    query: z
      .string()
      .describe("Optional free-text search across title and excerpt.")
      .optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, query }) => {
    const term = query?.trim().toLowerCase();
    const cat = category?.trim().toLowerCase();
    const posts = blogPosts
      .filter((post) => (cat ? post.category.toLowerCase() === cat : true))
      .filter((post) =>
        term
          ? `${post.title} ${post.excerpt}`.toLowerCase().includes(term)
          : true,
      )
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        category: post.category,
        date: post.date,
        readTime: post.readTime,
        excerpt: post.excerpt,
        author: post.author.name,
        url: `${SITE_URL}/blog/${post.slug}`,
      }));

    return {
      content: [{ type: "text" as const, text: JSON.stringify(posts, null, 2) }],
      structuredContent: { posts, count: posts.length },
    };
  },
});
