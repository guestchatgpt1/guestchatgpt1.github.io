/**
 * Loads webhook endpoints from the backend settings table and applies them
 * over the build-time defaults. Failures are non-fatal: the site keeps using
 * the defaults so a backend hiccup can never break the forms.
 */
import { supabase } from "@/integrations/supabase/client";
import { applyWebhookOverrides } from "@/lib/webhooks";

export interface WebhookSettingRow {
  id: string;
  key: string;
  label: string;
  url: string;
  method: string;
  enabled: boolean;
  notes: string | null;
  updated_at: string;
}

let loaded: Promise<void> | null = null;

export const loadWebhookSettings = (): Promise<void> => {
  if (loaded) return loaded;
  loaded = (async () => {
    try {
      const { data, error } = await supabase
        .from("webhook_settings")
        .select("key,url,method,enabled");
      if (error || !data) return;
      applyWebhookOverrides(data as Array<{ key: string; url: string; method: string; enabled: boolean }>);
    } catch {
      /* keep defaults */
    }
  })();
  return loaded;
};
