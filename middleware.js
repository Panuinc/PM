import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const RATE_WINDOW = 60 * 1000;
const RATE_LIMIT = 1000;
const requests = new Map();

function cleanOldRequests() {
  const now = Date.now();
  for (const [ip, times] of requests.entries()) {
    const recent = times.filter((t) => now - t < RATE_WINDOW);
    recent.length ? requests.set(ip, recent) : requests.delete(ip);
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  const now = Date.now();

  if (Math.random() < 0.02) cleanOldRequests();

  const hits = requests.get(ip) || [];
  const recent = hits.filter((t) => now - t < RATE_WINDOW);
  recent.push(now);
  requests.set(ip, recent);

  if (recent.length > RATE_LIMIT) {
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const tokenHeader = req.headers.get("authorization");
  const secret = process.env.SECRET_TOKEN;

  if (secret && tokenHeader === `Bearer ${secret}`) {
    return NextResponse.next();
  }

  const sessionToken = await getToken({ req });

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  const permissions = sessionToken.user?.permissions ?? [];
  const isSuperAdmin = permissions.includes("superadmin");

  if (isSuperAdmin) return NextResponse.next();

  const apiRoutes = {
    "/api/setting/user": "user.read",
    "/api/setting/permission": "permission.read",
    "/api/setting/userPermission": "userPermission.read",
    "/api/pm/machines": "machines.read",
  };

  const uiRoutes = {
    "/setting/user": "user.read",
    "/setting/permission": "permission.read",
    "/setting/userPermission": "userPermission.read",
    "/pm/machines": "machines.read",
  };

  if (pathname.startsWith("/api")) {
    for (const [route, required] of Object.entries(apiRoutes)) {
      if (pathname.startsWith(route) && !permissions.includes(required)) {
        return NextResponse.redirect(new URL("/forbidden", req.url));
      }
    }
    return NextResponse.next();
  }

  for (const [route, required] of Object.entries(uiRoutes)) {
    if (pathname.startsWith(route) && !permissions.includes(required)) {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/setting/:path*", "/pm/:path*", "/home"],
};
