/** QuantumAI Lab chat proxy for the administrator-configured n8n assistant. */
import { getWebhookSetting, requestWebhook } from "../_shared/webhook-config.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

const shorten = (text: string, limit: number) =>
  text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;

/** Keep upstream marketing replies useful without allowing oversized chat bubbles. */
const compactReply = (text: string): string => {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const output: string[] = [];
  let bulletCount = 0;
  let paragraphCount = 0;
  let totalLength = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (output.length > 0 && output[output.length - 1] !== "") output.push("");
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      if (bulletCount >= 4) continue;
      const next = `- ${shorten(bullet[1], 170)}`;
      if (totalLength + next.length > 900) continue;
      output.push(next);
      totalLength += next.length;
      bulletCount += 1;
      continue;
    }

    const isHeading = /^(#{1,6}\s+|\*\*[^*]+\*\*:?$)/.test(trimmed);
    if (!isHeading) {
      if (paragraphCount >= 2) continue;
      paragraphCount += 1;
    }

    const next = shorten(trimmed, isHeading ? 100 : 260);
    if (totalLength + next.length > 900) continue;
    output.push(next);
    totalLength += next.length;
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
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

    const setting = await getWebhookSetting("chat");
    if (setting.method !== "GET") return json({ error: "The chat webhook must use GET." }, 502);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    let res: Response;
    try {
      res = await requestWebhook(setting, {
        signal: controller.signal,
        query: {
          message: history[history.length - 1].content,
          messages: JSON.stringify(history),
          source: "quantumailab.website",
          response_style: "concise",
          instruction: "Answer in a concise, helpful format. Use short paragraphs and at most 4 bullets. Avoid repeating the company introduction unless asked.",
        },
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
    const reply = compactReply(asReply(payload).trim());
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
