import {
  decryptBytes,
  encryptBytes,
  pbkdf2Sha256,
  randomBytes,
} from "./insecureCrypto";

const VAULT_KEY = "catalog_admin_vault";
const PBKDF2_ITERATIONS = 310_000;
const FALLBACK_ITERATIONS = 60_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const KEY_BYTES = 32;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const subtle = () =>
  globalThis.crypto?.subtle && globalThis.isSecureContext
    ? globalThis.crypto.subtle
    : null;

export const usingFallbackCrypto = () => subtle() === null;

const toBase64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));

const fromBase64 = (text) =>
  Uint8Array.from(atob(text), (char) => char.charCodeAt(0));

async function deriveKey(passphrase, salt) {
  const api = subtle();
  const baseKey = await api.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return api.deriveKey(
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

export function hasVault() {
  return Boolean(localStorage.getItem(VAULT_KEY));
}

export function clearVault() {
  localStorage.removeItem(VAULT_KEY);
}

export async function saveVault(settings, passphrase) {
  const plaintext = encoder.encode(JSON.stringify(settings));
  const api = subtle();

  if (!api) {
    const salt = randomBytes(SALT_BYTES);
    const iv = randomBytes(IV_BYTES);
    const key = pbkdf2Sha256(passphrase, salt, FALLBACK_ITERATIONS, KEY_BYTES);
    const payload = encryptBytes(key, iv, plaintext);

    localStorage.setItem(
      VAULT_KEY,
      JSON.stringify({
        v: 2,
        alg: "hmac-ctr",
        it: FALLBACK_ITERATIONS,
        salt: toBase64(salt),
        iv: toBase64(iv),
        data: toBase64(payload),
      }),
    );
    return;
  }

  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(passphrase, salt);

  const ciphertext = await api.encrypt({ name: "AES-GCM", iv }, key, plaintext);

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
    const salt = fromBase64(envelope.salt);
    const iv = fromBase64(envelope.iv);
    const data = fromBase64(envelope.data);

    if (envelope.alg === "hmac-ctr") {
      const key = pbkdf2Sha256(
        passphrase,
        salt,
        envelope.it || FALLBACK_ITERATIONS,
        KEY_BYTES,
      );
      const plaintext = decryptBytes(key, iv, data);
      if (!plaintext) return null;
      return JSON.parse(decoder.decode(plaintext));
    }

    const api = subtle();
    if (!api) return null;

    const key = await deriveKey(passphrase, salt);
    const plaintext = await api.decrypt({ name: "AES-GCM", iv }, key, data);
    return JSON.parse(decoder.decode(plaintext));
  } catch {
    return null;
  }
}
