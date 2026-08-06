import { DbClient } from "../db";
import { payments } from "../db/schema";
import { eq } from "drizzle-orm";

export class PaymentsRepository {
  constructor(private db: DbClient) {}

  async createPayment(orderId: string, amount: number, screenshotUrl?: string, storeId: string = "store_default") {
    const id = crypto.randomUUID();
    await this.db.insert(payments).values({
      id,
      storeId,
      orderId,
      amount,
      screenshotUrl,
      status: "pending",
    });
    return id;
  }

  async verifyPayment(paymentId: string) {
    await this.db.update(payments).set({ status: "verified", updatedAt: new Date().toISOString() }).where(eq(payments.id, paymentId));
  }
}
