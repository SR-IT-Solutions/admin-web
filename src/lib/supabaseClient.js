import { createClient } from "@supabase/supabase-js";

let client = null;
let clientKey = "";

export function getSupabaseClient(settings) {
  const key = `${settings.supabaseUrl}::${settings.supabaseKey}`;
  if (!settings.supabaseUrl || !settings.supabaseKey) return null;
  if (!client || key !== clientKey) {
    client = createClient(settings.supabaseUrl, settings.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    clientKey = key;
  }
  return client;
}

export const PRODUCTS_TABLE = "products";
