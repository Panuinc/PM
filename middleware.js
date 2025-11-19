import { NextResponse } from "next/server";

const RATE_WINDOW = 60 * 1000;
const RATE_LIMIT = 1000;
const requests = new Map();

function cleanOldRequests() {
  const now = Date.now();
  for (const [ip, times] of requests.entries()) {
    const recent = times.filter((t) => now - t < RATE_WINDOW);
    if (recent.length) requests.set(ip, recent);
    else requests.delete(ip);
  }
}

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  const now = Date.now();

  if (Math.random() < 0.02) cleanOldRequests();

  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const hits = requests.get(ip) || [];
  const filtered = hits.filter((t) => now - t < RATE_WINDOW);
  filtered.push(now);
  requests.set(ip, filtered);

  if (filtered.length > RATE_LIMIT) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const token = req.headers.get("authorization");
  const secret = process.env.SECRET_TOKEN;

  if (secret && token === `Bearer ${secret}`) {
    return NextResponse.next();
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const config = {
  matcher: ["/api/:path*"],
};
