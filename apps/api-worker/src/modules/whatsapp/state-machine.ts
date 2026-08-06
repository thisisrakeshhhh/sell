import { DbClient } from "../../db";
import { conversationSessions, customerMessages, customers } from "../../db/schema";
import { eq } from "drizzle-orm";
import { handleWaitingSku } from "./handlers/waitingSku";
import { handleWaitingName } from "./handlers/waitingName";
import { handleWaitingCustomName } from "./handlers/waitingCustomName";
import { handleWaitingNumber } from "./handlers/waitingNumber";
import { handleWaitingSize } from "./handlers/waitingSize";
import { handleWaitingAddress } from "./handlers/waitingAddress";

export interface ConversationContext {
  sku?: string;
  productId?: string;
  productName?: string;
  price?: number;
  customerName?: string;
  customName?: string;
  customNumber?: string;
  size?: string;
  address?: string;
}

export class WhatsAppStateMachine {
  constructor(private db: DbClient) {}

  async processIncomingMessage(phone: string, text: string, storeId: string = "store_default"): Promise<string> {
    const cleanText = text.trim();

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

    // 2. Ensure Active Session
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

    const context: ConversationContext = session.context ? JSON.parse(session.context) : {};

    // 3. Log Incoming Message
    await this.db.insert(customerMessages).values({
      id: crypto.randomUUID(),
      storeId,
      customerId: customer.id,
      direction: "incoming",
      message: cleanText,
    });

    let nextState = session.currentState;
    let reply = "";
    let updatedContext = { ...context };
    let draftId: string | undefined;

    // 4. ROUTE TO ISOLATED STATE HANDLERS
    switch (session.currentState) {
      case "WAITING_SKU": {
        const result = await handleWaitingSku(this.db, cleanText, context);
        nextState = result.nextState;
        reply = result.reply;
        updatedContext = result.updatedContext;
        break;
      }
      case "WAITING_NAME": {
        const result = await handleWaitingName(cleanText, context);
        nextState = result.nextState;
        reply = result.reply;
        updatedContext = result.updatedContext;
        break;
      }
      case "WAITING_CUSTOM_NAME": {
        const result = await handleWaitingCustomName(cleanText, context);
        nextState = result.nextState;
        reply = result.reply;
        updatedContext = result.updatedContext;
        break;
      }
      case "WAITING_NUMBER": {
        const result = await handleWaitingNumber(cleanText, context);
        nextState = result.nextState;
        reply = result.reply;
        updatedContext = result.updatedContext;
        break;
      }
      case "WAITING_SIZE": {
        const result = await handleWaitingSize(cleanText, context);
        nextState = result.nextState;
        reply = result.reply;
        updatedContext = result.updatedContext;
        break;
      }
      case "WAITING_ADDRESS": {
        const result = await handleWaitingAddress(this.db, cleanText, customer.id, context, storeId);
        nextState = result.nextState;
        reply = result.reply;
        updatedContext = result.updatedContext;
        draftId = result.draftId;
        break;
      }
      default: {
        reply = `Hi 👋\nWelcome to JerseyFlow! Reply with a product SKU code (e.g. *MU-001*, *BAR-004*, *RMA-007*, *IND-002*) to view details & start your order.`;
        nextState = "WAITING_SKU";
        break;
      }
    }

    // 5. Update Session Persistence
    await this.db
      .update(conversationSessions)
      .set({
        currentState: nextState,
        currentDraftOrderId: draftId || session.currentDraftOrderId,
        context: JSON.stringify(updatedContext),
        lastActivity: new Date().toISOString(),
      })
      .where(eq(conversationSessions.id, session.id));

    // 6. Log Outgoing Reply
    await this.db.insert(customerMessages).values({
      id: crypto.randomUUID(),
      storeId,
      customerId: customer.id,
      direction: "outgoing",
      message: reply,
    });

    return reply;
  }
}
