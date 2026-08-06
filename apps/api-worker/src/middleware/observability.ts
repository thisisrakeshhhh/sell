import { Context, Next } from "hono";

export async function observabilityMiddleware(c: Context, next: Next) {
  const startTime = Date.now();
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;

  c.set("requestId", requestId);

  await next();

  const executionTimeMs = Date.now() - startTime;
  const logTrace = {
    timestamp: new Date().toISOString(),
    requestId,
    storeId: c.req.header("X-Store-ID") || "store_default",
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    executionTimeMs,
    userAgent: c.req.header("User-Agent"),
  };

  console.log(JSON.stringify(logTrace));
}
