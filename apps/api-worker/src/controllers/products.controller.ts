import { Hono } from "hono";
import { getDb } from "../db";
import { ProductsRepository } from "../repositories/products.repository";
import { formatSuccessResponse, formatErrorResponse } from "../middleware/error";

export const productsRouter = new Hono<{ Bindings: { DB: D1Database } }>();

productsRouter.get("/", async (c) => {
  const db = getDb(c.env.DB);
  const repo = new ProductsRepository(db);
  const items = await repo.findAllActive();
  return c.json(formatSuccessResponse(items, "Products fetched successfully"));
});

productsRouter.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = getDb(c.env.DB);
  const repo = new ProductsRepository(db);
  const item = await repo.findBySlug(slug);

  if (!item) {
    return c.json(formatErrorResponse("Product not found"), 404);
  }
  return c.json(formatSuccessResponse(item, "Product detail fetched"));
});

productsRouter.get("/code/:code", async (c) => {
  const code = c.req.param("code");
  const db = getDb(c.env.DB);
  const repo = new ProductsRepository(db);
  const item = await repo.findByCode(code);

  if (!item) {
    return c.json(formatErrorResponse("Product code not found"), 404);
  }
  return c.json(formatSuccessResponse(item, "Product code detail fetched"));
});
