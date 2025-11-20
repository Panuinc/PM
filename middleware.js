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
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }
  // จะขึ้น production ลบออก
  const tokenHeader = req.headers.get("authorization");
  const secret = process.env.SECRET_TOKEN;
  if (tokenHeader === `Bearer ${secret}`) {
    return NextResponse.next();
  }
  //
  
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const session = await getToken({ req });

  if (!session) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  const permissions = session.user?.permissions ?? [];
  const isSuperAdmin = permissions.includes("superadmin");

  if (isSuperAdmin) return NextResponse.next();

  const apiRules = {
    "/api/setting/user": "user.read",
    "/api/setting/permission": "permission.read",
    "/api/setting/userPermission": "userPermission.read",
  };

  const uiRules = {
    "/setting/user": "user.read",
    "/setting/permission": "permission.read",
    "/setting/userPermission": "userPermission.read",
  };

  if (pathname.startsWith("/api")) {
    for (const [route, perm] of Object.entries(apiRules)) {
      if (pathname.startsWith(route) && !permissions.includes(perm)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    return NextResponse.next();
  }

  for (const [route, perm] of Object.entries(uiRules)) {
    if (pathname.startsWith(route) && !permissions.includes(perm)) {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/setting/:path*", "/pm/:path*", "/home"],
};
