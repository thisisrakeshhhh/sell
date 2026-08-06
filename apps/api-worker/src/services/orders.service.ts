import { DbClient } from "../db";
import { orders, orderTimelineEvents, auditLogs, draftOrders } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { OrderStatusType } from "@jerseyflow/config";

export class OrderService {
  constructor(private db: DbClient) {}

  /**
   * Centralized Order Status Machine Transition Method with Optimistic Locking
   */
  async changeStatus(
    orderId: string,
    newStatus: OrderStatusType,
    currentVersion: number,
    storeId: string = "store_default",
    performedBy: string = "system",
    note?: string
  ) {
    // 1. Fetch current order with optimistic locking version check
    const order = (
      await this.db
        .select()
        .from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.version, currentVersion)))
        .limit(1)
    )[0];

    if (!order) {
      throw new Error(`Order ${orderId} version conflict or not found`);
    }

    const previousStatus = order.status;

    // 2. Update status & increment optimistic locking version in D1
    await this.db
      .update(orders)
      .set({
        status: newStatus,
        version: currentVersion + 1,
        updatedAt: new Date().toISOString(),
        ...(newStatus === "CONFIRMED" ? { confirmationCalled: true } : {}),
      })
      .where(and(eq(orders.id, orderId), eq(orders.version, currentVersion)));

    // 3. Create Typed Event Type
    const eventTypeMap: Record<string, string> = {
      NEW: "ORDER_CREATED",
      WAITING_CALL: "ORDER_CREATED",
      CONFIRMED: "CALL_CONFIRMED",
      WAITING_PAYMENT: "PAYMENT_REMINDER_SENT",
      PAID: "PAYMENT_VERIFIED",
      PRINTING: "PRINTING_STARTED",
      PACKED: "PACKED",
      SHIPPED: "SHIPPED",
      DELIVERED: "DELIVERED",
      CANCELLED: "CANCELLED",
    };

    const typedEventType = eventTypeMap[newStatus] || `STATUS_${newStatus}`;

    await this.db.insert(orderTimelineEvents).values({
      id: crypto.randomUUID(),
      storeId: order.storeId || storeId,
      orderId,
      eventType: typedEventType,
      title: typedEventType.replace(/_/g, " "),
      description: note || `Order status updated from ${previousStatus} to ${newStatus}`,
    });

    // 4. Record Audit Log
    await this.db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      storeId: order.storeId || storeId,
      action: `ORDER_STATUS_CHANGED_${typedEventType}`,
      entity: "orders",
      entityId: orderId,
      performedBy,
    });

    return { success: true, orderId, newVersion: currentVersion + 1, previousStatus, newStatus };
  }

  /**
   * Converts a draft_order into a real production order upon owner confirmation
   */
  async confirmDraftToOrder(draftId: string, storeId: string = "store_default") {
    const draft = (await this.db.select().from(draftOrders).where(eq(draftOrders.id, draftId)).limit(1))[0];
    if (!draft) {
      throw new Error(`Draft order ${draftId} not found`);
    }

    const orderId = crypto.randomUUID();
    const orderNumber = `JF-${Math.floor(10000 + Math.random() * 90000)}`;

    await this.db.insert(orders).values({
      id: orderId,
      storeId: draft.storeId || storeId,
      orderNumber,
      customerId: draft.customerId,
      productId: draft.productId || "MU-001",
      size: draft.size || "L",
      customName: draft.customName,
      customNumber: draft.customNumber,
      quantity: 1,
      totalAmount: 999,
      customerPhone: "+919999999999",
      shippingAddress: draft.shippingAddress || "Indiranagar, Bengaluru",
      status: "WAITING_CALL",
      version: 1,
    });

    // Delete draft
    await this.db.delete(draftOrders).where(eq(draftOrders.id, draftId));

    return { orderId, orderNumber };
  }
}
