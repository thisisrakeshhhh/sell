import { DbClient } from "../../../db";
import { draftOrders } from "../../../db/schema";
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

  const draftId = crypto.randomUUID();

  // Create Draft Order in D1 Database
  await db.insert(draftOrders).values({
    id: draftId,
    storeId,
    customerId,
    productId: context.productId,
    selectedSku: context.sku,
    customName: context.customName,
    customNumber: context.customNumber,
    size: context.size,
    shippingAddress: address,
    status: "READY_FOR_CONFIRMATION",
  });

  const reply = `✅ *Thank you!*
Your request has been received.

*Product:* ${context.productName || context.sku}
*Size:* ${context.size}
*Custom Name:* ${context.customName || "None"}
*Custom Number:* ${context.customNumber || "None"}

Our team will call you shortly to confirm your order details.`;

  return {
    nextState: "WAITING_CALL",
    reply,
    updatedContext: context,
    draftId,
  };
}
