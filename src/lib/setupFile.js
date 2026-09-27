export const SETUP_FIELDS = [
  "supabaseUrl",
  "supabaseKey",
  "cloudName",
  "uploadPreset",
  "adminEmail",
  "adminPassword",
];

export const FIELD_LABELS = {
  supabaseUrl: "Supabase URL",
  supabaseKey: "publishable key",
  cloudName: "Cloudinary cloud name",
  uploadPreset: "upload preset",
  adminEmail: "email",
  adminPassword: "password",
};

export function parseSetupFile(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: "That file isn't valid JSON. Check it opens in a text editor.",
    };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      ok: false,
      error: 'Expected a JSON object of settings, like { "supabaseUrl": … }.',
    };
  }

  const values = {};
  for (const field of SETUP_FIELDS) {
    const value = parsed[field];
    values[field] =
      typeof value === "string" || typeof value === "number"
        ? String(value).trim()
        : "";
  }

  if (!values.supabaseUrl && !values.supabaseKey) {
    return {
      ok: false,
      error:
        "No Supabase details in that file — it needs at least supabaseUrl and supabaseKey.",
    };
  }

  return {
    ok: true,
    values,
    found: SETUP_FIELDS.filter((field) => values[field]),
    missing: SETUP_FIELDS.filter((field) => !values[field]),
  };
}

export const SETUP_FILE_EXAMPLE = `{
  "supabaseUrl": "https://YOUR-PROJECT-REF.supabase.co",
  "supabaseKey": "sb_publishable_…",
  "cloudName": "your-cloudinary-cloud",
  "uploadPreset": "your_unsigned_preset",
  "adminEmail": "you@example.com",
  "adminPassword": "the Supabase user's password"
}`;
