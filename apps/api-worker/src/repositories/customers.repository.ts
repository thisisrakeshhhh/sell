import { DbClient } from "../db";
import { customers } from "../db/schema";
import { eq } from "drizzle-orm";

export class CustomersRepository {
  constructor(private db: DbClient) {}

  async findAll(storeId: string = "store_default") {
    return await this.db.select().from(customers).where(eq(customers.storeId, storeId));
  }

  async findByPhone(phone: string, storeId: string = "store_default") {
    const list = await this.db
      .select()
      .from(customers)
      .where(eq(customers.phoneNumber, phone))
      .limit(1);
    return list[0] || null;
  }

  async create(customerData: {
    phoneNumber: string;
    name?: string;
    instagramHandle?: string;
    source?: string;
    defaultAddress?: string;
    storeId?: string;
  }) {
    const id = crypto.randomUUID();
    await this.db.insert(customers).values({
      id,
      storeId: customerData.storeId || "store_default",
      phoneNumber: customerData.phoneNumber,
      name: customerData.name,
      instagramHandle: customerData.instagramHandle,
      source: customerData.source || "Instagram",
      defaultAddress: customerData.defaultAddress,
    });
    return id;
  }
}
