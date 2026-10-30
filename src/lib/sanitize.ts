// Input sanitization helpers. Used inside the Yup schema (see validation.ts),
// so the same cleaning runs in the browser and on the server.

// Control characters (\p{Cc}) plus zero-width / invisible characters
const INVISIBLE_CHARS = new RegExp("[\\p{Cc}\\u200B\\u200C\\u200D\\u2060\\uFEFF]", "gu");

// Anything that looks like an HTML tag, including an unclosed one at the end
const HTML_TAGS = /<[^>]*>?/g;

/** Generic text cleaner: normalizes, strips tags/invisible chars, collapses spaces. */
export function sanitizeText(input: unknown, maxLength = 255): string {
  if (typeof input !== "string") return "";

  return input
    .normalize("NFKC")
    .replace(INVISIBLE_CHARS, " ")
    .replace(HTML_TAGS, "")
    .replace(/[<>`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeName(input: unknown): string {
  return sanitizeText(input, 100);
}

export function sanitizeEmail(input: unknown): string {
  // emails never contain spaces, so remove them all, then lowercase
  return sanitizeText(input, 254).replace(/\s/g, "").toLowerCase();
}

export function sanitizePhone(input: unknown): string {
  if (typeof input !== "string") return "";

  let digits = input.replace(/\D/g, "");

  // +91 / 91 prefix  -> drop it
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  // 0 trunk prefix   -> drop it
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);

  // hard cap so absurdly long input never travels further
  return digits.slice(0, 15);
}