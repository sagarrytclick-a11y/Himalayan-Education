import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    "himalayan-admin-dev-secret"
  );
}

export function getAdminCredentials() {
  return {
    username:
      process.env.ADMIN_USERNAME ||
      process.env.NEXT_PUBLIC_ADMIN_USERNAME ||
      "admin",
    password:
      process.env.ADMIN_PASSWORD ||
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
      "admin123",
  };
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function createAdminSessionToken(username: string): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `${username}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined | null): {
  valid: boolean;
  username?: string;
} {
  if (!token) return { valid: false };

  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false };

  const [username, expStr, signature] = parts;
  const payload = `${username}.${expStr}`;
  const expected = sign(payload);

  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { valid: false };
    }
  } catch {
    return { valid: false };
  }

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) {
    return { valid: false };
  }

  return { valid: true, username };
}

export function sessionCookieOptions(maxAgeSeconds = SESSION_TTL_MS / 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/** Clear session cookie with attributes that match how it was set. */
export function clearAdminSessionCookie(response: NextResponse) {
  const expired = new Date(0);
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...sessionCookieOptions(0),
    maxAge: 0,
    expires: expired,
  });
  // Also clear a non-secure variant in case env flipped between deploys
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: expired,
  });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}

export async function getAdminSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

export function getAdminSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function requireAdmin(request: NextRequest) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return { ok: false as const, response: unauthorizedResponse() };
  }
  return { ok: true as const, username: session.username! };
}
