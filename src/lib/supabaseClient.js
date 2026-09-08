import { createClient } from "@supabase/supabase-js";

let client = null;
let clientKey = "";

/**
 * Returns a memoized Supabase client, recreating it only when the
 * URL/key pair actually changes (e.g. after the user edits Settings).
 */
export function getSupabaseClient(settings) {
  const key = `${settings.supabaseUrl}::${settings.supabaseKey}`;
  if (!settings.supabaseUrl || !settings.supabaseKey) return null;
  if (!client || key !== clientKey) {
    client = createClient(settings.supabaseUrl, settings.supabaseKey);
    clientKey = key;
  }
  return client;
}

export const PRODUCTS_TABLE = "catelog";
