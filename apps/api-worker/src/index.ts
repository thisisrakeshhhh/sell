import { Hono } from "hono";
import { requestLoggerMiddleware } from "./middleware/logger";
import { rateLimitMiddleware } from "./middleware/rate-limit";
import { errorHandler } from "./middleware/error";
import { healthRouter } from "./controllers/health.controller";
import { productsRouter } from "./controllers/products.controller";
import { ordersRouter } from "./controllers/orders.controller";
import { customersRouter } from "./controllers/customers.controller";
import { draftOrdersRouter } from "./controllers/draft-orders.controller";
import { webhooksRouter } from "./controllers/webhooks.controller";
import { dashboardRouter } from "./controllers/dashboard.controller";
import { searchRouter } from "./controllers/search.controller";

export interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  JWT_SECRET: string;
  ENVIRONMENT: string;
}

const app = new Hono<{ Bindings: Env }>();

// Global Middleware
app.use("*", requestLoggerMiddleware);
app.use("*", rateLimitMiddleware);
app.onError(errorHandler);

// CORS headers for Vercel storefront
app.use("*", async (c, next) => {
  await next();
  c.res.headers.set("Access-Control-Allow-Origin", "*");
  c.res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  c.res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
});

// Root Welcome Endpoint (Prevents 404 on http://127.0.0.1:8787/)
app.get("/", (c) => {
  return c.json({
    status: "online",
    name: "JerseyFlow Cloudflare Worker REST API",
    version: "v1.0.0",
    documentation: "https://github.com/thisisrakeshhhh/sell",
    endpoints: {
      health: "/api/v1/health",
      dashboard: "/api/v1/dashboard",
      catalog: "/api/v1/catalog",
      products: "/api/v1/products",
      orders: "/api/v1/orders",
      customers: "/api/v1/customers",
      search: "/api/v1/search?q=MU-001",
    },
  });
});

// Clean REST API Modules mounted under /api/v1
app.route("/api/v1/health", healthRouter);
app.route("/api/v1/dashboard", dashboardRouter);
app.route("/api/v1/search", searchRouter);
app.route("/api/v1/catalog", productsRouter);
app.route("/api/v1/products", productsRouter);
app.route("/api/v1/orders", ordersRouter);
app.route("/api/v1/draft-orders", draftOrdersRouter);
app.route("/api/v1/customers", customersRouter);
app.route("/api/v1/webhooks", webhooksRouter);

// Fallback 404 Handler
app.notFound((c) => {
  return c.json({
    success: false,
    message: `Route '${c.req.path}' not found. Try visiting '/' for API index or '/api/v1/health'`,
  }, 404);
});

export default app;
