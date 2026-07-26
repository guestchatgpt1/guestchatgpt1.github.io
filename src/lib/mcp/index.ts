import { defineMcp } from "@lovable.dev/mcp-js";
import getBlogPost from "./tools/get-blog-post";
import getCompanyInfo from "./tools/get-company-info";
import listBlogPosts from "./tools/list-blog-posts";
import listFaqs from "./tools/list-faqs";
import listPricingPlans from "./tools/list-pricing-plans";
import listServices from "./tools/list-services";

export default defineMcp({
  name: "quantumai-lab-mcp",
  title: "QuantumAI Lab",
  version: "0.1.0",
  instructions:
    "Public tools for QuantumAI Lab (quantum computing and AI consultancy). Use `get_company_info` for company profile and contact details, `list_services` for the service catalog, `list_pricing_plans` for plans and pricing, `list_faqs` for support questions, and `list_blog_posts` / `get_blog_post` to read published articles. All data is public marketing content; no user data is exposed.",
  tools: [getCompanyInfo, listServices, listPricingPlans, listFaqs, listBlogPosts, getBlogPost],
});
