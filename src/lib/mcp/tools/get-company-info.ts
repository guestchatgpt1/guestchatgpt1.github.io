import { defineTool } from "@lovable.dev/mcp-js";
import { company, SITE_URL } from "../content";

export default defineTool({
  name: "get_company_info",
  title: "Get company info",
  description:
    "Get QuantumAI Lab's public company profile: description, headquarters, contact details, leadership, and the list of site pages.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text" as const, text: JSON.stringify(company, null, 2) }],
    structuredContent: { company, siteUrl: SITE_URL },
  }),
});
