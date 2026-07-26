import { defineTool } from "@lovable.dev/mcp-js";
import { pricingPlans } from "../content";

export default defineTool({
  name: "list_pricing_plans",
  title: "List pricing plans",
  description:
    "List QuantumAI Lab's public pricing plans (Starter, Professional, Enterprise) with price, billing period and included features.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text" as const, text: JSON.stringify(pricingPlans, null, 2) }],
    structuredContent: { plans: pricingPlans },
  }),
});
