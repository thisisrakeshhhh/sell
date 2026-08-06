import { Context, Next } from "hono";
import { formatErrorResponse } from "./error";

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  const cookieToken = c.req.header("Cookie")?.match(/jf_token=([^;]+)/)?.[1];

  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : cookieToken;

  if (!token && c.req.path.startsWith("/api/v1/admin")) {
    return c.json(formatErrorResponse("Unauthorized - Admin Authentication Required"), 401);
  }

  await next();
}
