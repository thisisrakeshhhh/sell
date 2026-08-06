import { Hono } from "hono";
import { getDb } from "../db";
import { CustomerService } from "../services/customers.service";
import { formatSuccessResponse } from "../middleware/error";

export const customersRouter = new Hono<{ Bindings: { DB: D1Database } }>();

customersRouter.get("/", async (c) => {
  const db = getDb(c.env.DB);
  const service = new CustomerService(db);
  const customers = await service.getAllCustomers();
  return c.json(formatSuccessResponse(customers, "Customers fetched successfully"));
});
