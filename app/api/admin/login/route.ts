import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminCredentials,
  sessionCookieOptions,
} from "@/lib/adminAuth";

const attempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 1000 * 60 * 10; // 10 minutes

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function getClientKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    const clientKey = getClientKey(request);
    const record = attempts.get(clientKey);
    const now = Date.now();

    if (record?.lockedUntil && record.lockedUntil > now) {
      const minutes = Math.ceil((record.lockedUntil - now) / 60000);
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${minutes} min.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const creds = getAdminCredentials();
    const valid =
      safeEqual(username, creds.username) && safeEqual(password, creds.password);

    if (!valid) {
      const prev = attempts.get(clientKey) || { count: 0, lockedUntil: 0 };
      const count = prev.count + 1;
      const lockedUntil = count >= MAX_ATTEMPTS ? now + LOCK_MS : 0;
      attempts.set(clientKey, { count: lockedUntil ? 0 : count, lockedUntil });

      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    attempts.delete(clientKey);

    const token = createAdminSessionToken(username);
    const response = NextResponse.json({
      ok: true,
      user: { username },
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
