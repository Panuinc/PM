import { NextResponse } from "next/server";
import logger from "@/lib/logger.edge";

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
  logger.info({ message: "Incoming request", ip, pathname });

  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const hits = requests.get(ip) || [];
  const filtered = hits.filter((t) => now - t < RATE_WINDOW);
  filtered.push(now);
  requests.set(ip, filtered);

  if (filtered.length > RATE_LIMIT) {
    logger.warn({ message: "Rate limit exceeded", ip, count: filtered.length });
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const token = req.headers.get("authorization");
  const key = req.headers.get("x-api-key");
  const secret = process.env.SECRET_TOKEN;

  if (token === `Bearer ${secret}` || key === secret)
    return NextResponse.next();

  logger.warn({ message: "Unauthorized request", ip });
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const config = {
  matcher: ["/api/:path*"],
};
