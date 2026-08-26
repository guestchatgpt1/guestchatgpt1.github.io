/** QuantumAI Lab chat proxy for the configured n8n assistant. */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CHAT_WEBHOOK_URL = "https://sovivik.app.n8n.cloud/webhook/chat-assistant";

type Message = { role: "user" | "assistant"; content: string };

const asReply = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  for (const key of ["reply", "response", "output", "message", "text"]) {
    if (typeof record[key] === "string") return record[key] as string;
  }
  if (Array.isArray(value) && value.length > 0) return asReply(value[0]);
  return "";
};

const json = (body: unknown, status: number) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = (await req.json()) as {
      messages?: Message[];
    };

    const history = (messages ?? [])
      .filter((m) => typeof m?.content === "string" && m.content.trim())
      .slice(-12)
      .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content.slice(0, 2000) }));

    if (history.length === 0) {
      return json({ error: "No message provided." }, 400);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    let res: Response;
    try {
      res = await fetch(CHAT_WEBHOOK_URL, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          message: history[history.length - 1].content,
          messages: history,
          source: "quantumailab.website",
        }),
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      const detail = await res.text();
      console.error("chat_webhook_error", res.status, detail.slice(0, 500));
      return json({ error: "The assistant could not answer that right now." }, 502);
    }

    const contentType = res.headers.get("content-type") ?? "";
    const raw = await res.text();
    let payload: unknown = raw;
    if (contentType.includes("application/json")) {
      try { payload = JSON.parse(raw); } catch { /* use raw text */ }
    }
    const reply = asReply(payload).trim();
    if (!reply) return json({ error: "The assistant returned an empty response." }, 502);

    const stream = `data: ${JSON.stringify({ choices: [{ delta: { content: reply } }] })}\n\ndata: [DONE]\n\n`;
    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (err) {
    console.error("chat_error", err);
    const timedOut = err instanceof DOMException && err.name === "AbortError";
    return json({ error: timedOut ? "The assistant timed out. Please try again." : "Unexpected error. Please try again." }, timedOut ? 504 : 500);
  }
});
