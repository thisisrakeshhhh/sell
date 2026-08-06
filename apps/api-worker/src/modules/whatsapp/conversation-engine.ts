import { DbClient } from "../../db";
import { conversationSessions, customerMessages, customers, products, draftOrders } from "../../db/schema";
import { eq } from "drizzle-orm";

export type StateType =
  | "WAITING_SKU"
  | "WAITING_NAME"
  | "WAITING_NUMBER"
  | "WAITING_SIZE"
  | "WAITING_ADDRESS"
  | "WAITING_CALL"
  | "WAITING_PAYMENT"
  | "PAID";

export interface ConversationContext {
  sku?: string;
  name?: string;
  number?: string;
  size?: string;
  address?: string;
}

export class ConversationStateMachine {
  constructor(private db: DbClient) {}

  async processIncomingMessage(phone: string, text: string, storeId: string = "store_default"): Promise<string> {
    const cleanText = text.trim();
    const upperText = cleanText.toUpperCase();

    // 1. Ensure Customer Record
    let customer = (await this.db.select().from(customers).where(eq(customers.phoneNumber, phone)).limit(1))[0];
    if (!customer) {
      const customerId = crypto.randomUUID();
      await this.db.insert(customers).values({
        id: customerId,
        storeId,
        phoneNumber: phone,
        source: "WhatsApp",
      });
      customer = { id: customerId, storeId, phoneNumber: phone, name: null, instagramHandle: null, source: "WhatsApp", defaultAddress: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    }

    // 2. Ensure Active Conversation Session
    let session = (await this.db.select().from(conversationSessions).where(eq(conversationSessions.customerId, customer.id)).limit(1))[0];
    if (!session) {
      const sessionId = crypto.randomUUID();
      await this.db.insert(conversationSessions).values({
        id: sessionId,
        storeId,
        customerId: customer.id,
        currentState: "WAITING_SKU",
        context: JSON.stringify({}),
      });
      session = { id: sessionId, storeId, customerId: customer.id, currentState: "WAITING_SKU", currentDraftOrderId: null, context: JSON.stringify({}), lastActivity: new Date().toISOString(), createdAt: new Date().toISOString() };
    }

    const currentContext: ConversationContext = session.context ? JSON.parse(session.context) : {};

    // 3. Audit Customer Incoming Message
    await this.db.insert(customerMessages).values({
      id: crypto.randomUUID(),
      storeId,
      customerId: customer.id,
      direction: "incoming",
      message: cleanText,
    });

    let replyMessage = "";
    let nextState: StateType = session.currentState as StateType;

    // 4. STATE MACHINE TRANSITIONS USING CLEAN JSON CONTEXT
    if (session.currentState === "WAITING_SKU") {
      const product = (await this.db.select().from(products).where(eq(products.code, upperText)).limit(1))[0];

      if (product) {
        nextState = "WAITING_NAME";
        currentContext.sku = product.code;

        await this.db.update(conversationSessions).set({
          currentState: "WAITING_NAME",
          context: JSON.stringify(currentContext),
          lastActivity: new Date().toISOString(),
        }).where(eq(conversationSessions.id, session.id));

        replyMessage = `✅ *${product.name}* (SKU: ${product.code})\n\nPrice: ₹${product.basePrice}\nAvailable Sizes: S, M, L, XL, 2XL\n\n👇 View Photos & Details:\nhttps://jerseyflow.vercel.app/products/${product.slug}\n\nWhat name would you like printed on the jersey? (or type "NONE")`;
      } else {
        replyMessage = `Hi 👋\nWelcome to JerseyFlow! Reply with a product SKU code (e.g. *MU-001*, *BAR-004*, *RMA-007*, *IND-002*) to check details & start your order.`;
      }
    } else if (session.currentState === "WAITING_NAME") {
      currentContext.name = upperText === "NONE" ? "" : upperText;
      nextState = "WAITING_NUMBER";

      await this.db.update(conversationSessions).set({
        currentState: "WAITING_NUMBER",
        context: JSON.stringify(currentContext),
        lastActivity: new Date().toISOString(),
      }).where(eq(conversationSessions.id, session.id));

      replyMessage = `What squad number would you like printed on back? (e.g. 7, 10, or "NONE"):`;
    } else if (session.currentState === "WAITING_NUMBER") {
      currentContext.number = upperText === "NONE" ? "" : upperText;
      nextState = "WAITING_SIZE";

      await this.db.update(conversationSessions).set({
        currentState: "WAITING_SIZE",
        context: JSON.stringify(currentContext),
        lastActivity: new Date().toISOString(),
      }).where(eq(conversationSessions.id, session.id));

      replyMessage = `Please select your jersey size:\nS\nM\nL\nXL\n2XL`;
    } else if (session.currentState === "WAITING_SIZE") {
      currentContext.size = upperText;
      nextState = "WAITING_ADDRESS";

      await this.db.update(conversationSessions).set({
        currentState: "WAITING_ADDRESS",
        context: JSON.stringify(currentContext),
        lastActivity: new Date().toISOString(),
      }).where(eq(conversationSessions.id, session.id));

      replyMessage = `Size set to ${upperText}.\n\nPlease reply with your complete Delivery Address:`;
    } else if (session.currentState === "WAITING_ADDRESS") {
      currentContext.address = cleanText;
      const draftId = crypto.randomUUID();

      // Create draft order in draft_orders table (isolates incomplete inputs)
      await this.db.insert(draftOrders).values({
        id: draftId,
        storeId,
        customerId: customer.id,
        selectedSku: currentContext.sku,
        customName: currentContext.name,
        customNumber: currentContext.number,
        size: currentContext.size,
        shippingAddress: cleanText,
        status: "READY_FOR_CONFIRMATION",
      });

      // Update session state
      await this.db.update(conversationSessions).set({
        currentState: "WAITING_CALL",
        currentDraftOrderId: draftId,
        context: JSON.stringify(currentContext),
        lastActivity: new Date().toISOString(),
      }).where(eq(conversationSessions.id, session.id));

      replyMessage = `🎉 Draft Order Created!\n\nSKU: ${currentContext.sku}\nCustom Name: ${currentContext.name || "None"}\nCustom Number: ${currentContext.number || "None"}\nSize: ${currentContext.size}\nAddress: ${cleanText}\n\nStatus: 🟡 WAITING_CALL\nA JerseyFlow store owner will call you shortly to confirm your order!`;
    } else {
      replyMessage = `Your order is currently processing. Reply with a new SKU (e.g. *MU-001*) anytime to start another order.`;
    }

    // 5. Audit Worker Outgoing Message
    await this.db.insert(customerMessages).values({
      id: crypto.randomUUID(),
      storeId,
      customerId: customer.id,
      direction: "outgoing",
      message: replyMessage,
    });

    return replyMessage;
  }
}
