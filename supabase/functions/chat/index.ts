/**
 * QuantumAI Lab assistant.
 *
 * Streams a grounded, conversational reply from the Lovable AI gateway so the
 * widget always gets a fast, reliable answer (the previous n8n webhook was
 * intermittently timing out for 90s+).
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are the QuantumAI Lab assistant — a friendly, concise expert guide on the QuantumAI Lab website (tagline: "Where Intelligence Meets Infinity").

About the company:
- QuantumAI Lab builds quantum computing and AI solutions for enterprises.
- Services: Quantum Computing, AI & Machine Learning, Hybrid Quantum-Classical Systems, Research & Consulting, Enterprise Solutions.
- Pricing: tiered plans (Starter, Growth/Professional, Enterprise) — for exact figures point users to the /pricing page.
- Contact: info@quantumailab.in, +91-8652074439, Mumbai, India-421204. Leadership: Mr. Sateesh Singh (M.Sc., MCA).
- Site pages: /about, /services, /technology, /case-studies, /pricing, /blog, /faq, /contact.

Rules:
- Answer in 2-4 short sentences unless asked for detail. Plain, natural language.
- Never invent prices, client names, or capabilities. If unsure, say so and point to /contact.
- Suggest a relevant page link when helpful.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = (await req.json()) as {
      messages?: { role: "user" | "assistant"; content: string }[];
    };

    const history = (messages ?? [])
      .filter((m) => typeof m?.content === "string" && m.content.trim())
      .slice(-12)
      .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content.slice(0, 2000) }));

    if (history.length === 0) {
      return new Response(JSON.stringify({ error: "No message provided." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Lovable-API-Key": apiKey,
        "Content-Type": "application/json",
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      const message =
        res.status === 429
          ? "The assistant is busy right now. Please try again in a moment."
          : res.status === 402
            ? "The assistant is temporarily unavailable. Please email info@quantumailab.in."
            : "The assistant could not answer that right now.";
      console.error("ai_gateway_error", res.status, detail.slice(0, 500));
      return new Response(JSON.stringify({ error: message }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(res.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (err) {
    console.error("chat_error", err);
    return new Response(JSON.stringify({ error: "Unexpected error. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
