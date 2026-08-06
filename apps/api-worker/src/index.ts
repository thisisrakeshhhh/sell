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

export default app;
