import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { faqs } from "../content";

export default defineTool({
  name: "list_faqs",
  title: "List FAQs",
  description:
    "List QuantumAI Lab's frequently asked questions and answers, optionally filtered by category (General, Services, Pricing & Plans, Technology).",
  inputSchema: {
    category: z
      .string()
      .describe("Optional category filter, matched case-insensitively.")
      .optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const groups = category
      ? faqs.filter((group) => group.category.toLowerCase() === category.trim().toLowerCase())
      : faqs;
    return {
      content: [{ type: "text" as const, text: JSON.stringify(groups, null, 2) }],
      structuredContent: { groups },
    };
  },
});
