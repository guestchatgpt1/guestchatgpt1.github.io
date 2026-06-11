/**
 * Centralized n8n webhook client with structured logging + lightweight
 * telemetry (request id, status code, latency). Logs go to the browser
 * console as JSON so they're easy to grep / forward to a log sink.
 *
 * In production a buffer of the most recent calls is also kept on
 * `window.__webhookTelemetry__` for live debugging.
 */

export type WebhookMethod = "GET" | "POST";

export interface WebhookCallOptions {
  /** Logical name for the webhook (used in logs). */
  name: string;
  url: string;
  method: WebhookMethod;
  /** JSON body (POST) — will be serialized. */
  body?: unknown;
  /** Query params (GET or POST). Values are stringified. */
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Abort the request after this many ms (default 20000). */
  timeoutMs?: number;
  /** Pass an external AbortSignal in addition to the timeout. */
  signal?: AbortSignal;
  /** Extra headers (POST). */
  headers?: Record<string, string>;
}

export interface WebhookCallResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
  rawText: string | null;
  /** Round-trip time in ms. */
  latencyMs: number;
  /** Correlation id sent as X-Request-Id and logged. */
  requestId: string;
  error?: string;
}

const TELEMETRY_BUFFER_SIZE = 50;

const genRequestId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const pushTelemetry = (entry: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  const w = window as unknown as { __webhookTelemetry__?: Record<string, unknown>[] };
  if (!w.__webhookTelemetry__) w.__webhookTelemetry__ = [];
  w.__webhookTelemetry__.push(entry);
  if (w.__webhookTelemetry__.length > TELEMETRY_BUFFER_SIZE) w.__webhookTelemetry__.shift();
};

const log = (level: "info" | "warn" | "error", payload: Record<string, unknown>) => {
  const entry = { ts: new Date().toISOString(), level, scope: "webhook", ...payload };
  // eslint-disable-next-line no-console
  const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.info;
  fn(`[webhook] ${entry.event ?? ""}`, entry);
  pushTelemetry(entry);
};

const parseBody = async (res: Response): Promise<{ data: unknown; raw: string }> => {
  const raw = await res.text();
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json") && raw) {
    try { return { data: JSON.parse(raw), raw }; } catch { /* fall through */ }
  }
  return { data: raw, raw };
};

export async function callWebhook<T = unknown>(opts: WebhookCallOptions): Promise<WebhookCallResult<T>> {
  const requestId = genRequestId();
  const timeoutMs = opts.timeoutMs ?? 20_000;
  const started = (typeof performance !== "undefined" ? performance.now() : Date.now());

  // Build final URL with query params
  const url = new URL(opts.url);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const onExternalAbort = () => controller.abort();
  if (opts.signal) opts.signal.addEventListener("abort", onExternalAbort);

  log("info", {
    event: "request",
    name: opts.name,
    method: opts.method,
    url: url.origin + url.pathname,
    requestId,
  });

  try {
    const init: RequestInit = {
      method: opts.method,
      signal: controller.signal,
      headers: {
        "X-Request-Id": requestId,
        ...(opts.method === "POST" ? { "Content-Type": "application/json" } : {}),
        ...(opts.headers ?? {}),
      },
    };
    if (opts.method === "POST" && opts.body !== undefined) {
      init.body = typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
    }

    const res = await fetch(url.toString(), init);
    const { data, raw } = await parseBody(res);
    const latencyMs = Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - started);

    if (!res.ok) {
      log("error", {
        event: "response_error",
        name: opts.name,
        status: res.status,
        latencyMs,
        requestId,
      });
      return {
        ok: false,
        status: res.status,
        data: data as T,
        rawText: raw,
        latencyMs,
        requestId,
        error: `Request failed (${res.status})`,
      };
    }

    log("info", {
      event: "response_ok",
      name: opts.name,
      status: res.status,
      latencyMs,
      requestId,
    });

    return { ok: true, status: res.status, data: data as T, rawText: raw, latencyMs, requestId };
  } catch (err) {
    const latencyMs = Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - started);
    const aborted = err instanceof DOMException && err.name === "AbortError";
    const message = aborted
      ? "Request timed out"
      : err instanceof Error ? err.message : "Network error";
    log("error", {
      event: aborted ? "timeout" : "network_error",
      name: opts.name,
      latencyMs,
      requestId,
      message,
    });
    return { ok: false, status: 0, data: null, rawText: null, latencyMs, requestId, error: message };
  } finally {
    clearTimeout(timeoutId);
    if (opts.signal) opts.signal.removeEventListener("abort", onExternalAbort);
  }
}

/**
 * Spam-protection: clients must leave the honeypot field empty. Bots that
 * naïvely fill every input will trip this and we silently fake success.
 */
export const HONEYPOT_FIELD = "company_website_url";

export const isHoneypotTripped = (value: string | undefined | null): boolean =>
  !!(value && value.trim().length > 0);

/**
 * Optional CAPTCHA hook. If a CAPTCHA provider is installed it can register
 * a token getter on `window.__getCaptchaToken__` and the forms will include
 * the token transparently. Returns null if no provider is registered.
 */
export const getCaptchaToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { __getCaptchaToken__?: () => Promise<string | null> | string | null };
  if (typeof w.__getCaptchaToken__ !== "function") return null;
  try {
    const t = await w.__getCaptchaToken__();
    return typeof t === "string" && t.length > 0 ? t : null;
  } catch {
    return null;
  }
};
