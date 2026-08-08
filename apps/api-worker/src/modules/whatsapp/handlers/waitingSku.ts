import { DbClient } from "../../../db";
import { products } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { ConversationContext, ChatButton } from "../state-machine";

export async function handleWaitingSku(
  db: DbClient,
  text: string,
  context: ConversationContext
): Promise<{ nextState: string; reply: string; buttons?: ChatButton[]; updatedContext: ConversationContext }> {
  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();
  const upperText = cleanText.toUpperCase();

  const defaultButtons: ChatButton[] = [
    { text: "🔥 Real Madrid CR7", value: "RMA-007" },
    { text: "⚽ Barca Home", value: "BAR-004" },
    { text: "🔴 Man Utd Home", value: "MU-18" },
    { text: "🇮🇳 Team India T20", value: "IND-18" },
    { text: "🌐 Full Collection", value: "OVERALL COLLECTION" },
  ];

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

  // 2. CHECK EXACT SKU MATCH (Case-Insensitive e.g. "BAR-004", "bar-004", "RMA-007", "MU-18")
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

  // 3. STEP 1: CASUAL INITIAL GREETING (Gen-Z Hinglish)
  if (["hi", "hello", "hlo", "hyy", "hey", "start", "/start", "yo", "sup", "bhai"].includes(lowerText)) {
    return {
      nextState: "WAITING_SKU",
      reply: `Hyy! 👋 Welcome to JerseyFlow Store! 🔥\n\nHow can I assist you today? Are you looking to cook something fire for school, college, or turf today? ⚽\n\nTap a button below or type what you are looking for:`,
      buttons: defaultButtons,
      updatedContext: context,
    };
  }

  // 4. STEP 2: GENERAL CATEGORY INTEREST ("looking for cloth", "jercy", "clothes")
  if (
    lowerText.includes("cloth") ||
    lowerText.includes("looking") ||
    lowerText.includes("jercy") ||
    lowerText.includes("jersey") ||
    lowerText.includes("drip") ||
    lowerText.includes("wear")
  ) {
    return {
      nextState: "WAITING_SKU",
      reply: `Ayy looking to cook at school, college, or turf huh! ⚽🔥\n\nWhat vibe are you looking for? Tap a quick option below or reply with a player/club!`,
      buttons: defaultButtons,
      updatedContext: context,
    };
  }

  // 5. STEP 3: OVERALL COLLECTION REQUEST
  if (lowerText.includes("overall") || lowerText.includes("collection") || lowerText.includes("all")) {
    return {
      nextState: "WAITING_SKU",
      reply: `Explore our complete master quality showroom collection here:  \n👉 🌐 http://localhost:3000/products\n\nOr tap a quick jersey below to start customizing your order:`,
      buttons: [
        { text: "🔥 Real Madrid CR7", value: "RMA-007" },
        { text: "⚽ Barca Home 24/25", value: "BAR-004" },
        { text: "🔴 Man Utd Home", value: "MU-18" },
        { text: "🇮🇳 Team India T20", value: "IND-18" },
      ],
      updatedContext: context,
    };
  }

  // 6. STEP 4: SPECIFIC PLAYER / TEAM SEARCH (CR7, CR07, RONALDO, MESSI, BARCA, MADRID, INDIA)
  if (
    lowerText.includes("cr7") ||
    lowerText.includes("cr07") ||
    lowerText.includes("ronaldo") ||
    lowerText.includes("messi") ||
    lowerText.includes("barca") ||
    lowerText.includes("barcelona") ||
    lowerText.includes("madrid") ||
    lowerText.includes("real") ||
    lowerText.includes("manchester") ||
    lowerText.includes("united") ||
    lowerText.includes("india")
  ) {
    return {
      nextState: "WAITING_SKU",
      reply: `Oh fire choice! ⚽🔥 We got these top tier master quality options in stock:\n\n• *Real Madrid CR7 Edition* (SKU: *RMA-007*) - ₹999\n  👉 View Photos: http://localhost:3000/products/real-madrid-home-24-25\n\n• *FC Barcelona Home 24/25* (SKU: *BAR-004*) - ₹1099\n  👉 View Photos: http://localhost:3000/products/fc-barcelona-away-24-25\n\n• *Man United Home 24/25* (SKU: *MU-18*) - ₹999\n  👉 View Photos: http://localhost:3000/products/manchester-united-home-24-25\n\nTap a button below to customize back print name & squad number!`,
      buttons: [
        { text: "Order RMA-007 (CR7)", value: "RMA-007" },
        { text: "Order BAR-004 (Barca)", value: "BAR-004" },
        { text: "Order MU-18 (Man Utd)", value: "MU-18" },
        { text: "Order IND-18 (India)", value: "IND-18" },
      ],
      updatedContext: context,
    };
  }

  return {
    nextState: "WAITING_SKU",
    reply: `Hi 👋 Welcome to JerseyFlow! Tap a quick button below or type a player/club name (e.g. *CR7*, *Barca*) to start your order:`,
    buttons: defaultButtons,
    updatedContext: context,
  };
}
