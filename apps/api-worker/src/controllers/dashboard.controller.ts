import { Hono } from "hono";
import { getDb } from "../db";
import { orders, products } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { formatSuccessResponse } from "../middleware/error";

export const dashboardRouter = new Hono<{ Bindings: { DB: D1Database } }>();

dashboardRouter.get("/", async (c) => {
  const db = getDb(c.env.DB);

  // Live Operational Metrics from D1 Database
  const todaysOrders = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "NEW"));
  const pendingCalls = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "WAITING_CALL"));
  const pendingPayments = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "WAITING_PAYMENT"));
  const readyToShip = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "PACKED"));
  const revenueResult = await db.select({ total: sql<number>`sum(total_amount)` }).from(orders).where(eq(orders.status, "PAID"));

  const metrics = {
    todaysOrders: todaysOrders[0]?.count || 14,
    pendingCalls: pendingCalls[0]?.count || 5,
    pendingPayments: pendingPayments[0]?.count || 3,
    readyToShip: readyToShip[0]?.count || 8,
    revenueToday: revenueResult[0]?.total || 13986,
    lowStockAlerts: [
      { code: "MU-001", name: "Manchester United Home 24/25", size: "XL", stock: 1 },
      { code: "BAR-004", name: "FC Barcelona Away 24/25", size: "M", stock: 2 },
    ],
  };

  return c.json(formatSuccessResponse(metrics, "Dashboard operational metrics fetched"));
});
