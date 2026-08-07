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

  // 1. CHECK IF INCOMING MESSAGE IS MULTI-LINE SHOWROOM PAYLOAD FROM WEBSITE
  const skuMatch = text.match(/SKU:\s*([A-Z0-9-]+)/i);
  const sizeMatch = text.match(/Size:\s*([A-Z0-9]+)/i);
  const nameMatch = text.match(/Name:\s*([^\n]+)/i);
  const numberMatch = text.match(/Number:\s*([^\n]+)/i);

  if (skuMatch) {
    const extractedSku = skuMatch[1].toUpperCase();
    const product = (await db.select().from(products).where(eq(products.code, extractedSku)).limit(1))[0];

    context.sku = extractedSku;
    context.productId = product?.id || `p_${extractedSku}`;
    context.productName = product?.name || (text.match(/Product:\s*([^\n]+)/i)?.[1] || extractedSku);
    context.price = product?.basePrice || 999;

    if (sizeMatch && sizeMatch[1].toUpperCase() !== "NONE") {
      context.size = sizeMatch[1].toUpperCase();
    }
    if (nameMatch && nameMatch[1].toUpperCase() !== "NONE") {
      context.customName = nameMatch[1].trim();
    }
    if (numberMatch && numberMatch[1].toUpperCase() !== "NONE") {
      context.customNumber = numberMatch[1].trim();
    }

    return {
      nextState: "WAITING_ADDRESS",
      reply: `🔥 *Order Booking Initiated!*\n\n*Product:* ${context.productName}\n*SKU:* ${context.sku}\n*Size:* ${context.size || "L"}\n*Custom Name:* ${context.customName || "None"}\n*Custom Number:* ${context.customNumber || "None"}\n*Price:* ₹${context.price}\n\n📍 Please reply with your *FULL DELIVERY ADDRESS* (House No, Street, City, Pincode) to complete your order booking.`,
      updatedContext: context,
    };
  }

  // 2. CHECK IF SINGLE SKU WAS SENT (e.g. "MU-001" or "MU-18")
  const product = (await db.select().from(products).where(eq(products.code, upperText)).limit(1))[0];

  if (product) {
    context.sku = product.code;
    context.productId = product.id;
    context.productName = product.name;
    context.price = product.basePrice;

    return {
      nextState: "WAITING_NAME",
      reply: `✅ *${product.name}* (SKU: ${product.code})\n\nPrice: ₹${product.basePrice}\nAvailable Sizes: S, M, L, XL, 2XL\n\nFirst, what is your *FULL NAME*?`,
      updatedContext: context,
    };
  }

  return {
    nextState: "WAITING_SKU",
    reply: `Hi 👋\nWelcome to JerseyFlow! Reply with a product SKU code (e.g. *MU-001*, *BAR-004*, *RMA-007*, *IND-002*) to check details & start your order.`,
    updatedContext: context,
  };
}
