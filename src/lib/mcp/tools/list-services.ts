import { defineTool } from "@lovable.dev/mcp-js";
import { services } from "../content";

export default defineTool({
  name: "list_services",
  title: "List services",
  description:
    "List the services QuantumAI Lab offers, each with a description and key capabilities.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text" as const, text: JSON.stringify(services, null, 2) }],
    structuredContent: { services },
  }),
});
