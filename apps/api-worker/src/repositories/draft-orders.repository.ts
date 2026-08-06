import { DbClient } from "../db";
import { draftOrders } from "../db/schema";
import { eq } from "drizzle-orm";

export class DraftOrdersRepository {
  constructor(private db: DbClient) {}

  async createDraft(draftData: {
    customerId: string;
    productId?: string;
    selectedSku?: string;
    customName?: string;
    customNumber?: string;
    size?: string;
    shippingAddress?: string;
    storeId?: string;
  }) {
    const id = crypto.randomUUID();
    await this.db.insert(draftOrders).values({
      id,
      storeId: draftData.storeId || "store_default",
      customerId: draftData.customerId,
      productId: draftData.productId,
      selectedSku: draftData.selectedSku,
      customName: draftData.customName,
      customNumber: draftData.customNumber,
      size: draftData.size,
      shippingAddress: draftData.shippingAddress,
      status: "READY_FOR_CONFIRMATION",
    });
    return id;
  }

  async findById(draftId: string) {
    const list = await this.db.select().from(draftOrders).where(eq(draftOrders.id, draftId)).limit(1);
    return list[0] || null;
  }

  async delete(draftId: string) {
    await this.db.delete(draftOrders).where(eq(draftOrders.id, draftId));
  }
}
