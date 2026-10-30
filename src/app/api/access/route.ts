import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE_SECONDS,
  createAccessToken,
  verifyAccessToken,
} from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { emailSchema } from "@/lib/validation";
import { verifyTurnstile } from "@/lib/turnstile";

const NO_STORE = { "Cache-Control": "private, no-store" };

// Does this browser already have download access?
export async function GET(req: NextRequest) {
  const registered = verifyAccessToken(req.cookies.get(ACCESS_COOKIE)?.value);
  return NextResponse.json({ registered }, { headers: NO_STORE });
}

// Returning visitor: is this email registered? If yes, grant access.
export async function POST(req: NextRequest) {
  // 1. Parse body
  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("Body must be an object");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400 }
    );
  }

  // 2. Validate + sanitize the email (same rules as the form)
  let email: string;
  try {
    email = await emailSchema.validate(body.email);
  } catch {
    return NextResponse.json(
      { success: false, message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  // 3. Turnstile
  const token = body.turnstileToken;
  if (typeof token !== "string" || token.trim() === "") {
    return NextResponse.json(
      { success: false, message: "Please complete the security check." },
      { status: 400 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const turnstile = await verifyTurnstile(token, ip);

  if (turnstile === "invalid") {
    return NextResponse.json(
      { success: false, message: "Security check failed. Please try again." },
      { status: 403 }
    );
  }
  if (turnstile === "error") {
    return NextResponse.json(
      { success: false, message: "Could not verify the security check. Please try again." },
      { status: 503 }
    );
  }

  // 4. Look the email up
  let found: { id: number } | null;
  try {
    found = await prisma.registration.findUnique({
      where: { email },
      select: { id: true },
    });
  } catch (err) {
    console.error("Registration lookup failed:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  if (!found) {
    return NextResponse.json(
      { success: true, registered: false },
      { headers: NO_STORE }
    );
  }

  // 5. Registered: grant download access
  let accessToken: string;
  try {
    accessToken = createAccessToken();
  } catch (err) {
    console.error("Could not create access token:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  const res = NextResponse.json(
    { success: true, registered: true },
    { headers: NO_STORE }
  );
  res.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ACCESS_MAX_AGE_SECONDS,
  });
  return res;
}