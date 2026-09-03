import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.25.76";

const FEEDBACK_WEBHOOK_URL = "https://mibikef.app.n8n.cloud/webhook/feedback";
const responseHeaders = {
  ...corsHeaders,
  "Access-Control-Allow-Headers": `${corsHeaders["Access-Control-Allow-Headers"]}, x-request-id`,
};

const FeedbackSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255),
  feedback: z.string().trim().min(10).max(2000),
  source: z.string().trim().max(100).optional(),
  submittedAt: z.string().datetime().optional(),
  captchaToken: z.string().max(4000).optional(),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...responseHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: responseHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const parsed = FeedbackSchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Please check the feedback fields and try again." }, 400);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    let upstream: Response;
    try {
      upstream = await fetch(FEEDBACK_WEBHOOK_URL, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(parsed.data),
      });
    } finally {
      clearTimeout(timeout);
    }

    const raw = await upstream.text();
    if (!upstream.ok) {
      console.error("feedback_webhook_error", upstream.status, raw.slice(0, 300));
      return json({ error: `Feedback service returned ${upstream.status}.` }, 502);
    }

    return json({ ok: true });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "AbortError";
    console.error("feedback_proxy_error", timedOut ? "timeout" : error);
    return json({ error: timedOut ? "Feedback service timed out." : "Feedback service is unavailable." }, 504);
  }
});