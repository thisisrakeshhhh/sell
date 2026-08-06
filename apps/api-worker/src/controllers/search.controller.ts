import { Hono } from "hono";
import { getDb } from "../db";
import { products, orders, customers } from "../db/schema";
import { like, or } from "drizzle-orm";
import { formatSuccessResponse } from "../middleware/error";

export const searchRouter = new Hono<{ Bindings: { DB: D1Database } }>();

searchRouter.get("/", async (c) => {
  const query = c.req.query("q")?.trim();
  if (!query || query.length < 2) {
    return c.json(formatSuccessResponse({ products: [], orders: [], customers: [] }, "Search query too short"));
  }

  const db = getDb(c.env.DB);
  const pattern = `%${query}%`;

  // Search Products
  const matchedProducts = await db
    .select()
    .from(products)
    .where(or(like(products.name, pattern), like(products.code, pattern), like(products.club, pattern)))
    .limit(5);

  // Search Orders
  const matchedOrders = await db
    .select()
    .from(orders)
    .where(or(like(orders.orderNumber, pattern), like(orders.customerPhone, pattern), like(orders.customName, pattern)))
    .limit(5);

  // Search Customers
  const matchedCustomers = await db
    .select()
    .from(customers)
    .where(or(like(customers.name, pattern), like(customers.phoneNumber, pattern), like(customers.instagramHandle, pattern)))
    .limit(5);

  return c.json(
    formatSuccessResponse(
      {
        products: matchedProducts,
        orders: matchedOrders,
        customers: matchedCustomers,
      },
      "Global search completed"
    )
  );
});
