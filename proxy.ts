import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

const PUBLIC_ADMIN_API = new Set([
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/session",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin APIs (except login / logout / session check)
  if (pathname.startsWith("/api/admin/")) {
    if (PUBLIC_ADMIN_API.has(pathname)) {
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = verifyAdminSessionToken(token);
    if (!session.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
