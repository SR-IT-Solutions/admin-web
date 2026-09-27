const UPLOAD_URL = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;
const HAS_TRANSFORM = /^[a-z]{1,3}_[^/]+\//;

export function thumbUrl(url, size) {
  if (!url) return url;
  const match = url.match(UPLOAD_URL);
  if (!match) return url;
  const [, base, rest] = match;
  if (HAS_TRANSFORM.test(rest)) return url;
  return `${base}f_auto,q_auto,c_fill,g_auto,w_${size},h_${size}/${rest}`;
}

export function largeUrl(url, width = 1600) {
  if (!url) return url;
  const match = url.match(UPLOAD_URL);
  if (!match) return url;
  const [, base, rest] = match;
  if (HAS_TRANSFORM.test(rest)) return url;
  return `${base}f_auto,q_auto:good,c_limit,w_${width}/${rest}`;
}
