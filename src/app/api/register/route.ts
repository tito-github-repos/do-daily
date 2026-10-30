import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";
import { prisma } from "@/lib/prisma";
import { verifyTurnstile } from "@/lib/turnstile";
import { registrationSchema } from "@/lib/validation";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE_SECONDS,
  createAccessToken,
} from "@/lib/access";

const NO_STORE = { "Cache-Control": "private, no-store" };

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

// Same cookie /api/access sets, so the download button works right away
function withAccess(res: NextResponse): NextResponse {
  res.cookies.set(ACCESS_COOKIE, createAccessToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ACCESS_MAX_AGE_SECONDS,
  });
  return res;
}

function alreadyRegistered() {
  return withAccess(
    json(
      {
        success: false,
        alreadyRegistered: true,
        message: "Email already registered",
      },
      409,
    ),
  );
}

export async function POST(req: NextRequest) {
  try {
    // 1. Parse body
    let body: Record<string, unknown>;
    try {
      const parsed = await req.json();
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new Error("Body must be an object");
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return json({ success: false, message: "Invalid request." }, 400);
    }

    // 2. Honeypot: pretend success, do nothing
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return json({ success: true });
    }

    // 3. Validate + sanitize with the same schema the form uses
    let name: string;
    let email: string;
    let phone: string;
    try {
      const valid = await registrationSchema.validate(
        { name: body.name, email: body.email, phone: body.phone },
        { abortEarly: true },
      );
      ({ name, email, phone } = valid);
    } catch (err) {
      if (err instanceof ValidationError) {
        return json({ success: false, message: err.message }, 400);
      }
      throw err;
    }

    // 4. Turnstile
    const token = body.turnstileToken;
    if (typeof token !== "string" || token.trim() === "") {
      return json(
        { success: false, message: "Please complete the security check." },
        400,
      );
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const turnstile = await verifyTurnstile(token, ip);

    if (turnstile === "invalid") {
      return json(
        { success: false, message: "Security check failed. Please try again." },
        403,
      );
    }
    if (turnstile === "error") {
      return json(
        {
          success: false,
          message: "Could not verify the security check. Please try again.",
        },
        503,
      );
    }

    // 5. Already registered?
    const existing = await prisma.registration.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) return alreadyRegistered();

    // 6. Create (handles two submissions racing each other)
    try {
      await prisma.registration.create({
        data: { name, email, phone }, // rename `phone` if your Prisma field is `mobile`
      });
    } catch (createError) {
      if ((createError as { code?: string })?.code === "P2002") {
        return alreadyRegistered();
      }
      throw createError;
    }

    return withAccess(json({ success: true }));
  } catch (error) {
    console.error("Registration Error:", error);
    return json({ success: false, message: "Something went wrong" }, 500);
  }
}