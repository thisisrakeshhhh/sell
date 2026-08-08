import { Hono } from "hono";
import { getDb } from "../db";
import { OrdersRepository } from "../repositories/orders.repository";
import { createOrderSchema } from "@jerseyflow/validation";
import { formatSuccessResponse, formatErrorResponse } from "../middleware/error";

export const ordersRouter = new Hono<{ Bindings: { DB: D1Database; MEDIA_BUCKET: R2Bucket } }>();

ordersRouter.get("/", async (c) => {
  try {
    const db = getDb(c.env.DB);
    const repo = new OrdersRepository(db);
    const items = await repo.findAll();
    return c.json(formatSuccessResponse(items, "Orders fetched successfully"));
  } catch (err) {
    return c.json(formatErrorResponse("Failed to fetch orders"), 500);
  }
});

ordersRouter.get("/:orderNumber", async (c) => {
  const orderNumber = c.req.param("orderNumber");
  try {
    const db = getDb(c.env.DB);
    const repo = new OrdersRepository(db);
    const item = await repo.findByOrderNumber(orderNumber);
    if (item) {
      return c.json(formatSuccessResponse(item, "Order details fetched successfully"));
    }
    return c.json(formatErrorResponse(`Order #${orderNumber} not found`), 404);
  } catch (err) {
    return c.json(formatErrorResponse("Failed to fetch order details"), 500);
  }
});

ordersRouter.post("/", async (c) => {
  const body = await c.req.json();
  const validation = createOrderSchema.safeParse(body);

  if (!validation.success) {
    return c.json(
      formatErrorResponse(
        "Validation error",
        validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }))
      ),
      400
    );
  }

  const input = validation.data;
  const db = getDb(c.env.DB);
  const repo = new OrdersRepository(db);

  const totalAmount = 999 * input.quantity;

  const result = await repo.createOrderWithCustomer(
    {
      productId: input.productId,
      variantName: input.variantName,
      size: input.size,
      customName: input.customName,
      customNumber: input.customNumber,
      quantity: input.quantity,
      totalAmount,
      paymentMethod: input.paymentMethod,
      notes: input.notes,
    },
    {
      name: input.customerName,
      phoneNumber: input.customerPhone,
      instagramHandle: input.instagramHandle,
      shippingAddress: input.shippingAddress,
    }
  );

  return c.json(formatSuccessResponse(result, "Order created successfully"), 201);
});
