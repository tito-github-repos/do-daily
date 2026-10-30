import { createHmac, timingSafeEqual } from "node:crypto";

export const ACCESS_COOKIE = "dd_access";
export const ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function sign(payload: string): string {
  const secret = process.env.DOWNLOAD_COOKIE_SECRET;
  if (!secret) throw new Error("DOWNLOAD_COOKIE_SECRET is not set");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Token format: "<expiry-ms>.<signature>" */
export function createAccessToken(): string {
  const payload = String(Date.now() + ACCESS_MAX_AGE_SECONDS * 1000);
  return `${payload}.${sign(payload)}`;
}

export function verifyAccessToken(token: string | undefined): boolean {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expires = Number(payload);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}