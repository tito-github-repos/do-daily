import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, hasActiveAccess } from "@/lib/access";

const FILE_PATH = path.join(
  process.cwd(),
  "private",
  "DoDaily-Exercise-Sheet.pdf"
);

export async function GET(req: NextRequest) {
  // Genuine cookie AND the registration still exists in the database
  let allowed = false;
  try {
    allowed = await hasActiveAccess(req.cookies.get(ACCESS_COOKIE)?.value);
  } catch (err) {
    console.error("Access check failed:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 503 }
    );
  }

  if (!allowed) {
    return NextResponse.json(
      { success: false, message: "Please register to download the exercise sheet." },
      { status: 401 }
    );
  }

  try {
    const file = await readFile(FILE_PATH);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="DoDaily-Exercise-Sheet.pdf"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("Exercise sheet could not be read:", err);
    return NextResponse.json(
      { success: false, message: "The file is not available right now." },
      { status: 404 }
    );
  }
}