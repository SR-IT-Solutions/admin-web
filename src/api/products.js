import { PRODUCTS_TABLE } from "../lib/supabaseClient";

/**
 * Thin data-access layer around the "catelog" Supabase table. Every
 * function takes an already-constructed Supabase client so callers
 * control when/how that client is created (see SettingsContext).
 */

export async function fetchProducts(client) {
  const { data, error } = await client
    .from(PRODUCTS_TABLE)
    .select("*")
    .order("Title", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createProduct(client, payload) {
  const { error } = await client.from(PRODUCTS_TABLE).insert([payload]);
  if (error) throw error;
}

export async function updateProduct(client, id, payload) {
  const { error } = await client.from(PRODUCTS_TABLE).update(payload).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(client, id) {
  const { error } = await client.from(PRODUCTS_TABLE).delete().eq("id", id);
  if (error) throw error;
}

/** Maps a form's local state into the exact column shape Supabase expects. */
export function toPayload(form) {
  return {
    Title: form.Title.trim(),
    Category: form.Category,
    Price: parseFloat(form.Price),
    Tag: form.Tag.trim(),
    Description: form.Description.trim(),
    Featured: form.Featured ? "true" : "false",
    "Image URL": form["Image URL"],
    "Supported RAMs": form["Supported RAMs"],
    "Supported Processors": form["Supported Processors"],
    "Supported Storage": form["Supported Storage"],
  };
}
