import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { blogPosts } from "../../../data/blogPosts";
import { SITE_URL } from "../content";

function renderContent(post: (typeof blogPosts)[number]) {
  return post.content
    .map((block) => {
      switch (block.type) {
        case "h2":
          return `## ${block.text ?? ""}`;
        case "h3":
          return `### ${block.text ?? ""}`;
        case "quote":
          return `> ${block.text ?? ""}`;
        case "list":
          return (block.items ?? []).map((item) => `- ${item}`).join("\n");
        default:
          return block.text ?? "";
      }
    })
    .join("\n\n");
}

export default defineTool({
  name: "get_blog_post",
  title: "Get blog post",
  description:
    "Get the full text of a QuantumAI Lab blog article by its slug, rendered as markdown.",
  inputSchema: {
    slug: z.string().describe("The article slug, e.g. from list_blog_posts."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const post = blogPosts.find((item) => item.slug === slug.trim());
    if (!post) {
      return {
        content: [
          {
            type: "text" as const,
            text: `No blog post found with slug "${slug}". Use list_blog_posts to see available slugs.`,
          },
        ],
        isError: true,
      };
    }

    const markdown = [
      `# ${post.title}`,
      `${post.category} · ${post.date} · ${post.readTime} · by ${post.author.name} (${post.author.role})`,
      renderContent(post),
    ].join("\n\n");

    return {
      content: [{ type: "text" as const, text: markdown }],
      structuredContent: {
        slug: post.slug,
        title: post.title,
        category: post.category,
        date: post.date,
        readTime: post.readTime,
        author: post.author,
        url: `${SITE_URL}/blog/${post.slug}`,
        markdown,
      },
    };
  },
});
