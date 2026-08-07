import { DbClient } from "../../../db";
import { draftOrders, orders, orderTimelineEvents } from "../../../db/schema";
import { ConversationContext } from "../state-machine";

export async function handleWaitingAddress(
  db: DbClient,
  text: string,
  customerId: string,
  context: ConversationContext,
  storeId: string = "store_default"
): Promise<{ nextState: string; reply: string; updatedContext: ConversationContext; draftId: string }> {
  const address = text.trim();
  context.address = address;

  const draftId = `draft_${Date.now()}`;
  const orderId = `ord_${Date.now()}`;
  const orderNumber = `JF-${Math.floor(1000 + Math.random() * 9000)}`;
  const totalAmount = context.price || 999;

  // 1. Create Draft Order in D1 Database
  await db.insert(draftOrders).values({
    id: draftId,
    storeId,
    customerId,
    productId: context.productId || "p_1",
    selectedSku: context.sku || "MU-18",
    customName: context.customName,
    customNumber: context.customNumber,
    size: context.size || "L",
    shippingAddress: address,
    status: "CONFIRMED",
  });

  // 2. Create Official Order in D1 Database
  try {
    await db.insert(orders).values({
      id: orderId,
      storeId,
      orderNumber,
      customerId,
      productId: context.productId || "p_1",
      size: context.size || "L",
      customName: context.customName || null,
      customNumber: context.customNumber || null,
      quantity: 1,
      totalAmount,
      customerPhone: "+919999999999",
      shippingAddress: address,
      paymentMethod: "upi",
      paymentStatus: "pending",
      status: "NEW",
    });

    await db.insert(orderTimelineEvents).values({
      id: `evt_${Date.now()}`,
      storeId,
      orderId,
      eventType: "ORDER_CREATED",
      title: "Order Booked via WhatsApp",
      description: `Order ${orderNumber} created for ${context.productName || context.sku}`,
    });
  } catch (err) {
    console.log("Order insertion fallback:", err);
  }

  const reply = `🎉 *ORDER BOOKED SUCCESSFULLY!*

*Order Number:* #${orderNumber}
*Product:* ${context.productName || context.sku}
*Size:* ${context.size || "L"}
*Custom Name:* ${context.customName || "None"}
*Custom Number:* ${context.customNumber || "None"}
*Delivery Address:* ${address}

💳 *Total Amount:* ₹${totalAmount} (Free Express Delivery)
*UPI ID:* \`jerseyflow@upi\`

📦 *Live Order Tracking:*
http://localhost:3000/track/${orderNumber}

Our team is preparing your jersey print! Reply with *PAYMENT SCREENSHOT* or *HELP* anytime.`;

  return {
    nextState: "COMPLETED",
    reply,
    updatedContext: context,
    draftId,
  };
}
