import { Hono } from "hono";
import { getDb } from "../db";
import { ProductsRepository } from "../repositories/products.repository";
import { formatSuccessResponse, formatErrorResponse } from "../middleware/error";

export const productsRouter = new Hono<{ Bindings: { DB: D1Database } }>();

const DEMO_PRODUCTS = [
  {
    id: "p_1",
    code: "MU-001",
    slug: "manchester-united-home-24-25",
    name: "Manchester United Home 24/25",
    sport: "Football",
    club: "Manchester United",
    basePrice: 999,
    stockS: 8,
    stockM: 14,
    stockL: 6,
    stockXl: 2,
    stock2xl: 0,
    isActive: true,
  },
  {
    id: "p_2",
    code: "BAR-004",
    slug: "fc-barcelona-away-24-25",
    name: "FC Barcelona Away 24/25",
    sport: "Football",
    club: "FC Barcelona",
    basePrice: 1099,
    stockS: 12,
    stockM: 2,
    stockL: 8,
    stockXl: 0,
    stock2xl: 4,
    isActive: true,
  },
  {
    id: "p_3",
    code: "RMA-007",
    slug: "real-madrid-home-24-25",
    name: "Real Madrid Home 24/25",
    sport: "Football",
    club: "Real Madrid",
    basePrice: 999,
    stockS: 0,
    stockM: 0,
    stockL: 0,
    stockXl: 1,
    stock2xl: 0,
    isActive: true,
  },
  {
    id: "p_4",
    code: "IND-002",
    slug: "team-india-t20-champions",
    name: "Team India T20 Champions Kit",
    sport: "Cricket",
    club: "India Cricket",
    basePrice: 899,
    stockS: 10,
    stockM: 15,
    stockL: 20,
    stockXl: 8,
    stock2xl: 5,
    isActive: true,
  },
];

productsRouter.get("/", async (c) => {
  try {
    const db = getDb(c.env.DB);
    const repo = new ProductsRepository(db);
    const items = await repo.findAllActive();
    return c.json(formatSuccessResponse(items.length > 0 ? items : DEMO_PRODUCTS, "Products fetched successfully"));
  } catch (err) {
    console.log("DB query fallback to demo products:", err);
    return c.json(formatSuccessResponse(DEMO_PRODUCTS, "Products fetched (fallback)"));
  }
});

productsRouter.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  try {
    const db = getDb(c.env.DB);
    const repo = new ProductsRepository(db);
    const item = await repo.findBySlug(slug);
    if (item) {
      return c.json(formatSuccessResponse(item, "Product detail fetched"));
    }
  } catch (err) {
    console.log("DB slug query fallback:", err);
  }

  const fallbackItem = DEMO_PRODUCTS.find((p) => p.slug === slug || p.code.toLowerCase() === slug.toLowerCase()) || DEMO_PRODUCTS[0];
  return c.json(formatSuccessResponse(fallbackItem, "Product detail fetched (fallback)"));
});

productsRouter.get("/code/:code", async (c) => {
  const code = c.req.param("code").toUpperCase();
  try {
    const db = getDb(c.env.DB);
    const repo = new ProductsRepository(db);
    const item = await repo.findByCode(code);
    if (item) {
      return c.json(formatSuccessResponse(item, "Product code detail fetched"));
    }
  } catch (err) {
    console.log("DB code query fallback:", err);
  }

  const fallbackItem = DEMO_PRODUCTS.find((p) => p.code === code) || DEMO_PRODUCTS[0];
  return c.json(formatSuccessResponse(fallbackItem, "Product code detail fetched (fallback)"));
});

productsRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const db = getDb(c.env.DB);
    const repo = new ProductsRepository(db);
    
    const createdProduct = await repo.createProduct({
      code: body.code,
      name: body.name,
      basePrice: Number(body.basePrice) || 999,
      stockS: Number(body.stockS) || 0,
      stockM: Number(body.stockM) || 0,
      stockL: Number(body.stockL) || 0,
      stockXl: Number(body.stockXl) || 0,
      stock2xl: Number(body.stock2xl) || 0,
    });

    return c.json(formatSuccessResponse(createdProduct, "Product stored in D1 database successfully"));
  } catch (err) {
    console.log("Error storing product in D1:", err);
    return c.json(formatErrorResponse("Failed to store product in D1 database"), 500);
  }
});
