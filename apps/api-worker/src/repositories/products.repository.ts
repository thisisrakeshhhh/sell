import { DbClient } from "../db";
import { products, productMedia, inventory } from "../db/schema";
import { eq, and } from "drizzle-orm";

export class ProductsRepository {
  constructor(private db: DbClient) {}

  async findAllActive() {
    return await this.db.query.products.findMany({
      where: eq(products.isActive, true),
      with: {
        // relations can be added when drizzle relations are exported
      },
    });
  }

  async findBySlug(slug: string) {
    const list = await this.db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return list[0] || null;
  }

  async findByCode(code: string) {
    const list = await this.db.select().from(products).where(eq(products.code, code.toUpperCase())).limit(1);
    return list[0] || null;
  }
}
