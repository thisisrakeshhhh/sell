import { Context, Next } from "hono";
import { formatErrorResponse } from "./error";

const requestCounts = new Map<string, { count: number; expires: number }>();
const RATE_LIMIT_MAX = 60; // 60 requests per minute
const WINDOW_MS = 60 * 1000;

export async function rateLimitMiddleware(c: Context, next: Next) {
  const ip = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "anonymous";
  const now = Date.now();

  const record = requestCounts.get(ip);
  if (!record || now > record.expires) {
    requestCounts.set(ip, { count: 1, expires: now + WINDOW_MS });
  } else {
    record.count++;
    if (record.count > RATE_LIMIT_MAX) {
      return c.json(formatErrorResponse("Too many requests. Please try again later."), 429);
    }
  }

  await next();
}
