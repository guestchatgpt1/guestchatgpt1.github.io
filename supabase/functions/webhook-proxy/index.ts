import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.25.76";
import { getWebhookSetting, requestWebhook } from "../_shared/webhook-config.ts";

const responseHeaders = { ...corsHeaders, "Access-Control-Allow-Headers": `${corsHeaders["Access-Control-Allow-Headers"]}, x-request-id` };
const RequestSchema = z.object({
  key: z.enum(["newsletter", "contact"]),
  query: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  body: z.unknown().optional(),
});
const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(100).optional(),
  department: z.enum(["general", "sales", "support", "partnerships", "marketing", "careers"]),
  message: z.string().trim().min(10).max(2000),
});
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...responseHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: responseHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Invalid webhook request." }, 400);
    const { key, query, body } = parsed.data;

    if (key === "newsletter") {
      const newsletter = z.object({ email: z.string().email().max(255), action: z.enum(["subscribe", "unsubscribe"]), source: z.string().max(100).optional(), submittedAt: z.string().datetime().optional(), captchaToken: z.string().max(4000).optional() }).safeParse(query);
      if (!newsletter.success) return json({ error: "Please check the newsletter request." }, 400);
    } else {
      const contact = ContactSchema.safeParse(body);
      if (!contact.success) return json({ error: "Please check the contact form fields." }, 400);
    }

    const setting = await getWebhookSetting(key);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    let upstream: Response;
    try {
      upstream = await requestWebhook(setting, { query, body, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }

    const raw = await upstream.text();
    if (!upstream.ok) {
      console.error("managed_webhook_error", key, upstream.status, raw.slice(0, 300));
      return json({ error: `Webhook returned ${upstream.status}.` }, 502);
    }
    return new Response(raw || JSON.stringify({ ok: true }), { status: upstream.status, headers: { ...responseHeaders, "Content-Type": upstream.headers.get("content-type") ?? "application/json" } });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "AbortError";
    console.error("managed_webhook_proxy_error", timedOut ? "timeout" : error);
    return json({ error: timedOut ? "Webhook timed out." : "Webhook service is unavailable." }, timedOut ? 504 : 502);
  }
});
