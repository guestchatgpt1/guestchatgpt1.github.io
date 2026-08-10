import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

/**
 * Public proxy for the LinkedIn article index kept in a Google Sheet.
 *
 * The sheet's CSV export does not send CORS headers, so the browser cannot
 * fetch it directly. This function fetches it server-side, parses the CSV
 * and returns a small, typed JSON payload.
 */
const SHEET_ID = "1aY2vjwibg1M2zfFOlFrX4fu8YG8MoR6xutZQ55oAFvA";
const SHEET_CSV = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { quoted = false; }
      } else field += c;
      continue;
    }
    if (c === '"') { quoted = true; continue; }
    if (c === ",") { row.push(field); field = ""; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; continue; }
    if (c === "\r") continue;
    field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** Sheet dates look like `25-Mar-2026`. */
function toIsoDate(value: string): string | null {
  const m = value.trim().match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (!m) {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  }
  const month = MONTHS[m[2].toLowerCase()];
  if (month === undefined) return null;
  return new Date(Date.UTC(Number(m[3]), month, Number(m[1]))).toISOString().slice(0, 10);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    const res = await fetch(SHEET_CSV, { signal: controller.signal, redirect: "follow" });
    clearTimeout(timeout);

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Sheet fetch failed (${res.status})`, articles: [] }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = parseCsv(await res.text());
    if (rows.length < 2) {
      return new Response(JSON.stringify({ articles: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const header = rows[0].map((h) => h.trim());
    const idx = (name: string) => header.findIndex((h) => h.toLowerCase() === name.toLowerCase());
    const iDate = idx("Date");
    const iTitle = idx("Title");
    const iTopic = idx("CoreTopic");
    const iUrn = idx("LinkedInPostURN");
    const iSummary = idx("TrendSummary");
    const iImage = idx("ImageUrl");
    const iCategory = idx("Category");
    const iPosted = idx("Posted");

    const at = (row: string[], i: number) => (i >= 0 ? (row[i] ?? "").trim() : "");

    const articles = rows.slice(1)
      .filter((row) => row.some((c) => c.trim()))
      .map((row) => {
        const urn = at(row, iUrn);
        const title = at(row, iTitle) || at(row, iTopic);
        return {
          title,
          topic: at(row, iTopic),
          category: at(row, iCategory),
          summary: at(row, iSummary),
          imageUrl: at(row, iImage),
          date: at(row, iDate),
          isoDate: toIsoDate(at(row, iDate)),
          urn,
          url: urn ? `https://www.linkedin.com/feed/update/${urn}/` : null,
          posted: at(row, iPosted).toLowerCase() === "yes",
        };
      })
      .filter((a) => a.title && a.url)
      .sort((a, b) => (b.isoDate ?? "").localeCompare(a.isoDate ?? ""));

    return new Response(JSON.stringify({ articles, count: articles.length }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message, articles: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
