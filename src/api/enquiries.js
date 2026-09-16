export const ENQUIRIES_TABLE = "enquiries";

const NO_ROWS =
  "The update changed no rows. Check the 'authenticated update' policy on public.enquiries.";

export async function fetchEnquiries(client) {
  const { data, error } = await client
    .from(ENQUIRIES_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createEnquiry(client, payload) {
  const { data, error } = await client
    .from(ENQUIRIES_TABLE)
    .insert([payload])
    .select("*");

  if (error) throw error;
  return data?.[0] ?? null;
}

export async function updateEnquiry(client, id, payload) {
  const { data, error } = await client
    .from(ENQUIRIES_TABLE)
    .update(payload)
    .eq("id", id)
    .select("*");

  if (error) throw error;
  if (!data || data.length === 0) throw new Error(NO_ROWS);
  return data[0];
}

export async function deleteEnquiry(client, id) {
  const { error } = await client
    .from(ENQUIRIES_TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export function toEnquiryPayload(form) {
  return {
    name: form.name.trim(),
    phone: form.phone.trim(),
    item: form.item.trim() || null,
    status: form.status,
    source: form.source,
    note: form.note.trim() || null,
  };
}
