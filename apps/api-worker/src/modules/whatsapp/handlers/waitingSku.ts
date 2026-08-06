import { DbClient } from "../../../db";
import { products } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { ConversationContext } from "../state-machine";

export async function handleWaitingSku(
  db: DbClient,
  text: string,
  context: ConversationContext
): Promise<{ nextState: string; reply: string; updatedContext: ConversationContext }> {
  const upperText = text.trim().toUpperCase();
  const product = (await db.select().from(products).where(eq(products.code, upperText)).limit(1))[0];

  if (product) {
    context.sku = product.code;
    context.productId = product.id;
    context.productName = product.name;
    context.price = product.basePrice;

    return {
      nextState: "WAITING_NAME",
      reply: `✅ *${product.name}* (SKU: ${product.code})\n\nPrice: ₹${product.basePrice}\nAvailable Sizes: S, M, L, XL, 2XL\n\n👇 View Photos & Detail:\nhttps://jerseyflow.vercel.app/products/${product.slug}\n\nFirst, what is your *FULL NAME*?`,
      updatedContext: context,
    };
  }

  return {
    nextState: "WAITING_SKU",
    reply: `Hi 👋\nWelcome to JerseyFlow! Reply with a product SKU code (e.g. *MU-001*, *BAR-004*, *RMA-007*, *IND-002*) to check details & start your order.`,
    updatedContext: context,
  };
}
