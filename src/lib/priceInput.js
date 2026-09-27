export function formatPriceInput(raw) {
  const text = String(raw ?? "").replace(/,/g, "");
  if (!text) return "";
  const [whole, fraction] = text.split(".");
  const wholeFormatted = whole ? Number(whole).toLocaleString("en-IN") : "";
  return fraction !== undefined ? `${wholeFormatted}.${fraction}` : wholeFormatted;
}

export function parsePriceInput(text) {
  const cleaned = String(text ?? "").replace(/[^\d.]/g, "");
  const [whole = "", ...rest] = cleaned.split(".");
  if (rest.length === 0) return whole;
  return `${whole}.${rest.join("").slice(0, 2)}`;
}

export function priceToNumber(raw) {
  const value = parseFloat(String(raw ?? "").replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}
