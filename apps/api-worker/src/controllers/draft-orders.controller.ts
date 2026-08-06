import { Hono } from "hono";
import { getDb } from "../db";
import { DraftOrdersRepository } from "../repositories/draft-orders.repository";
import { OrderService } from "../services/orders.service";
import { formatSuccessResponse, formatErrorResponse } from "../middleware/error";

export const draftOrdersRouter = new Hono<{ Bindings: { DB: D1Database } }>();

draftOrdersRouter.post("/", async (c) => {
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const repo = new DraftOrdersRepository(db);

  const draftId = await repo.createDraft({
    customerId: body.customerId || crypto.randomUUID(),
    productId: body.productId,
    selectedSku: body.selectedSku,
    customName: body.customName,
    customNumber: body.customNumber,
    size: body.size,
    shippingAddress: body.shippingAddress,
  });

  return c.json(formatSuccessResponse({ draftId }, "Draft order created"), 201);
});

draftOrdersRouter.post("/:id/confirm", async (c) => {
  const draftId = c.req.param("id");
  const db = getDb(c.env.DB);
  const orderService = new OrderService(db);

  const result = await orderService.confirmDraftToOrder(draftId);
  return c.json(formatSuccessResponse(result, "Draft order confirmed into production order"));
});
