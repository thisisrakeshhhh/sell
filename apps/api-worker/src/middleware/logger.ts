import { Context, Next } from "hono";

export const logger = {
  info: (msg: string, meta?: any) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, meta || ""),
  warn: (msg: string, meta?: any) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, meta || ""),
  error: (msg: string, meta?: any) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, meta || ""),
};

export async function requestLoggerMiddleware(c: Context, next: Next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.info(`${c.req.method} ${c.req.url} - ${c.res.status} (${ms}ms)`);
}
