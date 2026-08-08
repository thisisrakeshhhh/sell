import { DbClient } from "../../../db";
import { products } from "../../../db/schema";
import { eq, like, or } from "drizzle-orm";
import { ConversationContext } from "../state-machine";

export async function handleWaitingSku(
  db: DbClient,
  text: string,
  context: ConversationContext
): Promise<{ nextState: string; reply: string; updatedContext: ConversationContext }> {
  const cleanText = text.trim();
  const upperText = cleanText.toUpperCase();

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

  // 2. CHECK EXACT SKU MATCH (Case-Insensitive e.g. "BAR-004", "bar-004", "MU-18")
  const allProducts = await db.select().from(products);
  const matchedProduct = allProducts.find((p) => p.code.toUpperCase() === upperText || upperText.includes(p.code.toUpperCase()));

  if (matchedProduct) {
    context.sku = matchedProduct.code;
    context.productId = matchedProduct.id;
    context.productName = matchedProduct.name;
    context.price = matchedProduct.basePrice;

    return {
      nextState: "WAITING_NAME",
      reply: `✅ *${matchedProduct.name}* (SKU: ${matchedProduct.code})\n\nPrice: ₹${matchedProduct.basePrice}\nAvailable Sizes: S, M, L, XL, 2XL\n\nFirst, what is your *FULL NAME*?`,
      updatedContext: context,
    };
  }

  // 3. CASUAL GREETING & GEN-Z / HINGLISH CONVERSATIONAL BOT
  const lowerText = cleanText.toLowerCase();

  if (["hi", "hello", "hlo", "hyy", "hey", "start", "/start", "yo", "sup", "bhai"].includes(lowerText)) {
    return {
      nextState: "WAITING_SKU",
      reply: `Hyy! 👋 Welcome to JerseyFlow! 🔥\n\nLooking to cook something fire for school, college, or turf today? ⚽\nWhat jersey or player are you looking for? (e.g. CR7, Messi, Barca, Real Madrid, India)\n\nOr reply with a SKU code like *BAR-004*, *MU-18*, *RMA-007*, *IND-18*!`,
      updatedContext: context,
    };
  }

  // 4. KEYWORD ASSISTANT SEARCH (CR7, RONALDO, MESSI, BARCA, MADRID, CLOTH, LOOKING)
  if (
    lowerText.includes("cr7") ||
    lowerText.includes("ronaldo") ||
    lowerText.includes("messi") ||
    lowerText.includes("barca") ||
    lowerText.includes("barcelona") ||
    lowerText.includes("madrid") ||
    lowerText.includes("real") ||
    lowerText.includes("india") ||
    lowerText.includes("cloth") ||
    lowerText.includes("looking") ||
    lowerText.includes("jercy") ||
    lowerText.includes("jersey")
  ) {
    return {
      nextState: "WAITING_SKU",
      reply: `Yo! We got top tier master quality jerseys in stock! ⚽🔥\n\nPopular Picks:\n• *Real Madrid CR7 Edition* (SKU: *RMA-007*) - ₹999\n• *FC Barcelona Home 24/25* (SKU: *BAR-004*) - ₹1099\n• *FC Barcelona Away 24/25* (SKU: *BAR-10*) - ₹1099\n• *Man United Home 24/25* (SKU: *MU-18*) - ₹999\n• *Team India T20 Kit* (SKU: *IND-18*) - ₹899\n\n🌐 View full collection:\nhttp://localhost:3000/products\n\nReply with any SKU code (e.g. *BAR-004* or *RMA-007*) to customize back print name & number!`,
      updatedContext: context,
    };
  }

  return {
    nextState: "WAITING_SKU",
    reply: `Hi 👋 Welcome to JerseyFlow! Reply with a product SKU code (e.g. *MU-18*, *BAR-004*, *RMA-007*, *IND-18*) or type a player/club name (e.g. *CR7*, *Barca*) to check details & start your order.`,
    updatedContext: context,
  };
}
