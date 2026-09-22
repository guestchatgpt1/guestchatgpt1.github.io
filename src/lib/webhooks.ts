/**
 * Single source of truth for every outbound n8n webhook.
 *
 * The values below are the build-time defaults. At runtime they are
 * overridden by the rows stored in the backend `webhook_settings` table,
 * which are managed from the private admin settings page.
 */

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};

const N8N_HOST = "https://wewefom.app.n8n.cloud/webhook";

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
    url: env.VITE_FEEDBACK_WEBHOOK_URL ?? "https://xacade.app.n8n.cloud/webhook/feedback",
    method: "POST",
  },
} satisfies Record<string, WebhookEndpoint>;

export type WebhookName = keyof typeof WEBHOOKS;

/** Hosted n8n form used as a fallback when the feedback webhook is unreachable. */
export const FEEDBACK_FALLBACK_FORM_URL =
  env.VITE_FEEDBACK_FALLBACK_FORM_URL ??
  "https://xacade.app.n8n.cloud/form/cfcf4fd4-dba8-417c-ba04-19438a58409a";

let feedbackFallbackFormUrl = FEEDBACK_FALLBACK_FORM_URL;

export const getFeedbackFallbackFormUrl = () => feedbackFallbackFormUrl;

/** Key used for the fallback-form row in the backend settings table. */
export const FEEDBACK_FALLBACK_KEY = "feedback_fallback_form";

/**
 * Apply runtime overrides loaded from the backend settings table.
 * Unknown keys are ignored so extra rows can be added safely.
 */
export const applyWebhookOverrides = (
  rows: Array<{ key: string; url: string; method: string; enabled: boolean }>,
) => {
  for (const row of rows) {
    if (!row.enabled || !row.url) continue;
    if (row.key === FEEDBACK_FALLBACK_KEY) {
      feedbackFallbackFormUrl = row.url;
      continue;
    }
    const entry = (WEBHOOKS as Record<string, WebhookEndpoint>)[row.key];
    if (!entry) continue;
    entry.url = row.url;
    if (row.method === "GET" || row.method === "POST") entry.method = row.method;
  }
};

/** Public social + contact profiles, used across the site. */
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61593230084208",
  linkedin: "https://www.linkedin.com/in/quantumai-lab-08673542b/",
  x: "https://x.com/QuantumAILab",
  whatsapp: "https://wa.me/919920074439",
} as const;
