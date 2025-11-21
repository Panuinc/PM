import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { apiActionRules, uiMenuRules } from "@/config/permissions";

const RATE_WINDOW = 60 * 1000;
const RATE_LIMIT = 1000;
const requests = new Map();

/* ------------------------------- Rate Limit ------------------------------- */
function cleanOldRequests() {
  const now = Date.now();
  for (const [ip, times] of requests.entries()) {
    const recent = times.filter((t) => now - t < RATE_WINDOW);
    recent.length ? requests.set(ip, recent) : requests.delete(ip);
  }
}

/* -------------------------------- Middleware ------------------------------- */
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const method = req.method;
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  const now = Date.now();

  /* ------------------------------- Rate Check ------------------------------ */
  if (Math.random() < 0.02) cleanOldRequests();

  const hits = requests.get(ip) || [];
  const recent = hits.filter((t) => now - t < RATE_WINDOW);
  recent.push(now);
  requests.set(ip, recent);

  if (recent.length > RATE_LIMIT) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  /* --------------------------- Dev bypass --------------------------- */
  const tokenHeader = req.headers.get("authorization");
  const secret = process.env.SECRET_TOKEN;
  if (tokenHeader === `Bearer ${secret}`) return NextResponse.next();

  /* ----------------------------- Auth Skip ----------------------------- */
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  /* ------------------------------- Session Check ------------------------------ */
  const session = await getToken({ req });

  if (!session) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  const permissions = session.user?.permissions ?? [];
  const isAdminSuperAdmin = permissions.includes("admin.superadmin");

  if (isAdminSuperAdmin) return NextResponse.next();

  /* ----------------------------- API PBAC ----------------------------- */
  if (pathname.startsWith("/api")) {
    for (const [route, methods] of Object.entries(apiActionRules)) {
      if (pathname.startsWith(route)) {
        const neededPermission = methods[method];

        if (neededPermission && !permissions.includes(neededPermission)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }
    return NextResponse.next();
  }

  /* ----------------------------- UI PBAC ------------------------------ */
  for (const [route, perm] of Object.entries(uiMenuRules)) {
    if (pathname.startsWith(route) && !permissions.includes(perm)) {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  return NextResponse.next();
}

/* -------------------------------- Matcher -------------------------------- */
export const config = {
  matcher: ["/api/:path*", "/setting/:path*", "/pm/:path*", "/home"],
};
