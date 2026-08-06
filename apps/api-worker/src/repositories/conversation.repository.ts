import { DbClient } from "../db";
import { conversationSessions, customerMessages } from "../db/schema";
import { eq } from "drizzle-orm";

export class ConversationRepository {
  constructor(private db: DbClient) {}

  async findSessionByCustomerId(customerId: string) {
    const list = await this.db.select().from(conversationSessions).where(eq(conversationSessions.customerId, customerId)).limit(1);
    return list[0] || null;
  }

  async updateState(sessionId: string, state: string, contextJson: string) {
    await this.db.update(conversationSessions).set({
      currentState: state,
      context: contextJson,
      lastActivity: new Date().toISOString(),
    }).where(eq(conversationSessions.id, sessionId));
  }

  async logMessage(customerId: string, direction: "incoming" | "outgoing", message: string, storeId: string = "store_default") {
    await this.db.insert(customerMessages).values({
      id: crypto.randomUUID(),
      storeId,
      customerId,
      direction,
      message,
    });
  }
}
