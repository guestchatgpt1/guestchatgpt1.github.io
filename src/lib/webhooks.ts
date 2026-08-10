/**
 * Single source of truth for every outbound n8n webhook.
 *
 * Keeping the URLs + HTTP methods in one place means an endpoint migration
 * is a one-line change and nothing can drift out of sync. Each entry can be
 * overridden at build time with a Vite env var.
 */

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};

const N8N_HOST = "https://fopobiv.app.n8n.cloud/webhook";

export interface WebhookEndpoint {
  url: string;
  method: "GET" | "POST";
}

export const WEBHOOKS = {
  /** Newsletter subscribe / unsubscribe. */
  newsletter: {
    url: env.VITE_NEWSLETTER_WEBHOOK_URL ?? `${N8N_HOST}/QuantumAILabNewsletter`,
    method: "GET",
  },
  /** Contact-us form. */
  contact: {
    url: env.VITE_CONTACT_WEBHOOK_URL ?? `${N8N_HOST}/QuantumAILab-contact-us`,
    method: "POST",
  },
  /** AI chat assistant. */
  chat: {
    url: env.VITE_CHAT_WEBHOOK_URL ?? `${N8N_HOST}/chat-assistant`,
    method: "GET",
  },
  /** Feedback popup form. */
  feedback: {
    url: env.VITE_FEEDBACK_WEBHOOK_URL ?? "https://jawepah.app.n8n.cloud/webhook/feedback",
    method: "POST",
  },
} satisfies Record<string, WebhookEndpoint>;

export type WebhookName = keyof typeof WEBHOOKS;
