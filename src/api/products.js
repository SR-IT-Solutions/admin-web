import { PRODUCTS_TABLE } from "../lib/supabaseClient";

export async function fetchProducts(client) {
  const { data, error } = await client
    .from(PRODUCTS_TABLE)
    .select("*")
    .order("Title", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchProduct(client, id) {
  const { data, error } = await client
    .from(PRODUCTS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createProduct(client, payload) {
  const { error } = await client.from(PRODUCTS_TABLE).insert([payload]);
  if (error) throw error;
}

export async function updateProduct(client, id, payload) {
  const { data, error } = await client
    .from(PRODUCTS_TABLE)
    .update(payload)
    .eq("id", id)
    .select("id");
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error(
      "The update changed no rows. The 'authenticated update' policy is missing on public.products.",
    );
  }
}

export async function setProductActive(client, id, isActive) {
  const { data, error } = await client
    .from(PRODUCTS_TABLE)
    .update({ is_active: isActive })
    .eq("id", id)
    .select("id, is_active");
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error(
      "The update changed no rows. The 'authenticated update' policy is missing on public.products.",
    );
  }
  return data[0];
}

export async function deleteProduct(client, id) {
  const { error } = await client.from(PRODUCTS_TABLE).delete().eq("id", id);
  if (error) throw error;
}

export function toPayload(form) {
  return {
    Title: form.Title.trim(),
    Category: form.Category,
    Price: Number.isFinite(parseFloat(form.Price))
      ? parseFloat(form.Price)
      : null,
    Tag: form.Tag.trim(),
    Description: form.Description.trim(),
    Featured: form.Featured ? "true" : "false",
    is_active: Boolean(form.is_active),
    "Image URL": form["Image URL"],
    "Supported RAMs": form["Supported RAMs"],
    "Supported Processors": form["Supported Processors"],
    "Supported Storage": form["Supported Storage"],
  };
}
