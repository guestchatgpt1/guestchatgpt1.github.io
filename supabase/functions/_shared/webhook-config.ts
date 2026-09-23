import { createClient } from "npm:@supabase/supabase-js@2";

export type WebhookSetting = {
  key: string;
  url: string;
  method: "GET" | "POST";
  enabled: boolean;
};

const getAdminClient = () => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) throw new Error("Backend configuration is unavailable.");
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
};

export const getWebhookSetting = async (key: string): Promise<WebhookSetting> => {
  const { data, error } = await getAdminClient()
    .from("webhook_settings")
    .select("key,url,method,enabled")
    .eq("key", key)
    .maybeSingle();
  if (error || !data || !data.enabled) throw new Error(`Webhook '${key}' is unavailable.`);
  if (data.method !== "GET" && data.method !== "POST") throw new Error(`Webhook '${key}' has an invalid method.`);
  return data as WebhookSetting;
};

export const requestWebhook = async (
  setting: WebhookSetting,
  options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; signal: AbortSignal },
): Promise<Response> => {
  const target = new URL(setting.url);
  if (setting.method === "GET") {
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) target.searchParams.set(key, String(value));
    }
    return fetch(target, { method: "GET", signal: options.signal, headers: { Accept: "application/json" } });
  }
  return fetch(target, {
    method: "POST",
    signal: options.signal,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(options.body ?? {}),
  });
};
