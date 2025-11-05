import { NextResponse } from "next/server";
import logger from "@/lib/logger.edge";

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 1000;
const ipRequests = new Map();

function cleanupOldRequests() {
  const now = Date.now();
  for (const [ip, requests] of ipRequests.entries()) {
    const validRequests = requests.filter((t) => now - t < RATE_LIMIT_WINDOW);
    if (validRequests.length === 0) {
      ipRequests.delete(ip);
    } else {
      ipRequests.set(ip, validRequests);
    }
  }
}

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  const now = Date.now();

  if (Math.random() < 0.01) cleanupOldRequests();

  logger.info({ message: "Incoming request", pathname, ip });

  if (pathname.startsWith("/api/auth")) {
    logger.info({ message: "Auth route bypassed", pathname });
    return NextResponse.next();
  }

  const requestLog = ipRequests.get(ip) || [];
  const recentRequests = requestLog.filter((t) => now - t < RATE_LIMIT_WINDOW);
  recentRequests.push(now);
  ipRequests.set(ip, recentRequests);

  if (recentRequests.length > RATE_LIMIT_MAX) {
    logger.warn({
      message: "Rate limit exceeded",
      ip,
      count: recentRequests.length,
    });
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const authHeader = req.headers.get("authorization");
  const apiKey = req.headers.get("x-api-key");

  if (
    authHeader === `Bearer ${process.env.SECRET_TOKEN}` ||
    apiKey === process.env.SECRET_TOKEN
  ) {
    logger.info({ message: "Authorized request", ip });
    return NextResponse.next();
  }

  logger.warn({ message: "Unauthorized request", ip });
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const config = {
  matcher: ["/api/:path*"],
};
