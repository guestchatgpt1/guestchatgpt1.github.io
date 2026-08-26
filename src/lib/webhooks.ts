/**
 * Single source of truth for every outbound n8n webhook.
 *
 * Keeping the URLs + HTTP methods in one place means an endpoint migration
 * is a one-line change and nothing can drift out of sync. Each entry can be
 * overridden at build time with a Vite env var.
 */

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};

const N8N_HOST = "https://sovivik.app.n8n.cloud/webhook";

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
    method: "POST",
  },
  /** Feedback popup form. */
  feedback: {
    url: env.VITE_FEEDBACK_WEBHOOK_URL ?? "https://kayoge6.app.n8n.cloud/webhook/feedback",
    method: "GET",
  },
} satisfies Record<string, WebhookEndpoint>;

export type WebhookName = keyof typeof WEBHOOKS;

/** Hosted n8n form used as a fallback when the feedback webhook is unreachable. */
export const FEEDBACK_FALLBACK_FORM_URL =
  env.VITE_FEEDBACK_FALLBACK_FORM_URL ??
  "https://kayoge6.app.n8n.cloud/form/3758fb17-b23a-4263-9d39-937774107fc0";

/** Public social + contact profiles, used across the site. */
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61593230084208",
  linkedin: "https://www.linkedin.com/in/quantumai-lab-08673542b/",
  x: "https://x.com/QuantumAILab",
  whatsapp: "https://wa.me/919920074439",
} as const;
