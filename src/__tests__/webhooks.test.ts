/**
 * End-to-end webhook contract tests.
 *
 * These tests mock `globalThis.fetch` and assert that each form/widget in
 * the app talks to its n8n webhook with the correct HTTP method, payload
 * shape, and success/error handling.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { callWebhook } from "@/lib/webhook";
import { contactSchema, newsletterSchema, chatMessageSchema } from "@/lib/validation";

type MockResponseInit = {
  ok?: boolean;
  status?: number;
  body?: unknown;
  contentType?: string;
};

const mockResponse = ({ ok = true, status = 200, body = {}, contentType = "application/json" }: MockResponseInit = {}) => {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return Promise.resolve({
    ok,
    status,
    headers: { get: (k: string) => (k.toLowerCase() === "content-type" ? contentType : null) },
    text: () => Promise.resolve(text),
  } as unknown as Response);
};

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  // Silence info/warn/error logs from the webhook client during tests.
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("validation schemas", () => {
  it("newsletter rejects malformed emails", () => {
    expect(newsletterSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: "ok@example.com" }).success).toBe(true);
  });

  it("contact enforces length and required fields", () => {
    const base = { name: "Ada Lovelace", email: "ada@example.com", department: "general" as const, message: "Hello there from a curious user." };
    expect(contactSchema.safeParse(base).success).toBe(true);
    expect(contactSchema.safeParse({ ...base, message: "short" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, email: "bad" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, name: "A" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, name: "<script>" }).success).toBe(false);
  });

  it("chat message must be 1-1000 chars", () => {
    expect(chatMessageSchema.safeParse("").success).toBe(false);
    expect(chatMessageSchema.safeParse("hi").success).toBe(true);
    expect(chatMessageSchema.safeParse("x".repeat(1001)).success).toBe(false);
  });
});

describe("newsletter webhook (GET subscribe)", () => {
  it("uses GET with action=subscribe and email in the query", async () => {
    fetchMock.mockReturnValueOnce(mockResponse({ body: { ok: true } }));
    const res = await callWebhook({
      name: "newsletter.subscribe",
      url: "https://wiloka.app.n8n.cloud/webhook/QuantumAILabNewsletter",
      method: "GET",
      query: { email: "user@example.com", action: "subscribe", source: "quantumailab.website", submittedAt: "2026-01-01T00:00:00Z" },
    });
    expect(res.ok).toBe(true);
    const [calledUrl, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("GET");
    expect(init.body).toBeUndefined();
    const url = new URL(calledUrl as string);
    expect(url.searchParams.get("action")).toBe("subscribe");
    expect(url.searchParams.get("email")).toBe("user@example.com");
    expect((init.headers as Record<string, string>)["X-Request-Id"]).toBeTruthy();
  });

  it("returns ok:false on 5xx and reports latency + requestId", async () => {
    fetchMock.mockReturnValueOnce(mockResponse({ ok: false, status: 503, body: "down" }));
    const res = await callWebhook({
      name: "newsletter.subscribe",
      url: "https://wiloka.app.n8n.cloud/webhook/QuantumAILabNewsletter",
      method: "GET",
      query: { email: "user@example.com" },
    });
    expect(res.ok).toBe(false);
    expect(res.status).toBe(503);
    expect(res.requestId).toBeTruthy();
    expect(typeof res.latencyMs).toBe("number");
  });
});

describe("newsletter webhook (GET unsubscribe)", () => {
  it("sends action=unsubscribe", async () => {
    fetchMock.mockReturnValueOnce(mockResponse({ body: { ok: true } }));
    await callWebhook({
      name: "newsletter.unsubscribe",
      url: "https://wiloka.app.n8n.cloud/webhook/QuantumAILabNewsletter",
      method: "GET",
      query: { email: "user@example.com", action: "unsubscribe" },
    });
    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.searchParams.get("action")).toBe("unsubscribe");
  });
});

describe("contact webhook (POST)", () => {
  it("POSTs a JSON body with all required fields", async () => {
    fetchMock.mockReturnValueOnce(mockResponse({ body: { ok: true } }));
    await callWebhook({
      name: "contact.submit",
      url: "https://wiloka.app.n8n.cloud/webhook/QuantumAILab-contact-us",
      method: "POST",
      body: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        department: "sales",
        message: "Hello there from a curious user.",
        source: "quantumailab.website",
      },
    });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      name: "Ada Lovelace",
      email: "ada@example.com",
      department: "sales",
      source: "quantumailab.website",
    });
  });

  it("surfaces failures with status code", async () => {
    fetchMock.mockReturnValueOnce(mockResponse({ ok: false, status: 500, body: "boom" }));
    const res = await callWebhook({
      name: "contact.submit",
      url: "https://wiloka.app.n8n.cloud/webhook/QuantumAILab-contact-us",
      method: "POST",
      body: { name: "x" },
    });
    expect(res.ok).toBe(false);
    expect(res.status).toBe(500);
    expect(res.error).toMatch(/500/);
  });
});

describe("chat webhook (POST)", () => {
  it("sends message + history in JSON body, not the URL", async () => {
    fetchMock.mockReturnValueOnce(mockResponse({ body: { reply: "hi there" } }));
    const history = [{ role: "user", content: "hello" }];
    const res = await callWebhook({
      name: "chat.message",
      url: "https://wiloka.app.n8n.cloud/webhook/chat-assistant",
      method: "POST",
      body: { message: "hello", history, source: "quantumailab.website" },
    });
    expect(res.ok).toBe(true);
    expect((res.data as { reply: string }).reply).toBe("hi there");
    const [calledUrl, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    const url = new URL(calledUrl as string);
    expect(url.searchParams.get("message")).toBeNull();
    expect(url.searchParams.get("history")).toBeNull();
    const parsed = JSON.parse(init.body as string);
    expect(parsed.message).toBe("hello");
    expect(parsed.history).toEqual(history);
  });

  it("treats network failure as ok:false (no throw)", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    const res = await callWebhook({
      name: "chat.message",
      url: "https://wiloka.app.n8n.cloud/webhook/chat-assistant",
      method: "POST",
      body: { message: "hi", source: "quantumailab.website" },
    });
    expect(res.ok).toBe(false);
    expect(res.status).toBe(0);
    expect(res.error).toBeTruthy();
  });
});

describe("telemetry buffer", () => {
  it("records the last call on window.__webhookTelemetry__", async () => {
    fetchMock.mockReturnValueOnce(mockResponse({ body: { ok: true } }));
    await callWebhook({
      name: "newsletter.subscribe",
      url: "https://wiloka.app.n8n.cloud/webhook/QuantumAILabNewsletter",
      method: "GET",
      query: { email: "u@example.com" },
    });
    const telem = (window as unknown as { __webhookTelemetry__?: Array<Record<string, unknown>> }).__webhookTelemetry__;
    expect(telem && telem.length).toBeGreaterThan(0);
    const last = telem![telem!.length - 1];
    expect(last.scope).toBe("webhook");
    expect(last.name).toBe("newsletter.subscribe");
  });
});
