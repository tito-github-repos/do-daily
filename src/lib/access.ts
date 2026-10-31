import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const ACCESS_COOKIE = "dd_access";
export const ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function sign(payload: string): string {
  const secret = process.env.DOWNLOAD_COOKIE_SECRET;
  if (!secret) throw new Error("DOWNLOAD_COOKIE_SECRET is not set");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Token format: "<registration-id>.<expiry-ms>.<signature>" */
export function createAccessToken(registrationId: number): string {
  const payload = `${registrationId}.${Date.now() + ACCESS_MAX_AGE_SECONDS * 1000}`;
  return `${payload}.${sign(payload)}`;
}

/** Returns the registration id if the token is genuine and not expired, otherwise null. */
export function readAccessToken(token: string | undefined): number | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [idPart, expiryPart, signature] = parts;

  const id = Number(idPart);
  const expires = Number(expiryPart);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  if (!Number.isFinite(expires) || expires < Date.now()) return null;

  let expected: string;
  try {
    expected = sign(`${idPart}.${expiryPart}`);
  } catch {
    return null;
  }

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  return id;
}

/** True only if the cookie is genuine AND that registration still exists in the database. */
export async function hasActiveAccess(token: string | undefined): Promise<boolean> {
  const id = readAccessToken(token);
  if (id === null) return false;

  const row = await prisma.registration.findUnique({
    where: { id },
    select: { id: true },
  });
  return row !== null;
}