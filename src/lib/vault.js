/**
 * Passphrase-encrypted storage for the project credentials.
 *
 * The passphrase is never written anywhere — it is held in memory for the
 * session and used to derive an AES-GCM key via PBKDF2. That is what makes
 * this real: someone with access to this browser profile still cannot read
 * the Cloudinary upload preset or the Supabase key without the passphrase.
 *
 * A fresh random salt and IV are generated on every save, so the same
 * settings never encrypt to the same ciphertext twice.
 */

const VAULT_KEY = "catalog_admin_vault";
const PBKDF2_ITERATIONS = 310_000; // OWASP guidance for PBKDF2-SHA256
const SALT_BYTES = 16;
const IV_BYTES = 12;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toBase64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));

const fromBase64 = (text) =>
  Uint8Array.from(atob(text), (char) => char.charCodeAt(0));

async function deriveKey(passphrase, salt) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** True once the owner has saved settings on this browser. */
export function hasVault() {
  return Boolean(localStorage.getItem(VAULT_KEY));
}

export function clearVault() {
  localStorage.removeItem(VAULT_KEY);
}

export async function saveVault(settings, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(passphrase, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(JSON.stringify(settings)),
  );

  localStorage.setItem(
    VAULT_KEY,
    JSON.stringify({
      v: 1,
      salt: toBase64(salt),
      iv: toBase64(iv),
      data: toBase64(ciphertext),
    }),
  );
}

/**
 * Returns the decrypted settings, or null when the passphrase is wrong —
 * AES-GCM authentication fails rather than yielding garbage.
 */
export async function openVault(passphrase) {
  const raw = localStorage.getItem(VAULT_KEY);
  if (!raw) return null;

  let envelope;
  try {
    envelope = JSON.parse(raw);
  } catch {
    return null;
  }

  try {
    const key = await deriveKey(passphrase, fromBase64(envelope.salt));
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(envelope.iv) },
      key,
      fromBase64(envelope.data),
    );
    return JSON.parse(decoder.decode(plaintext));
  } catch {
    return null;
  }
}
