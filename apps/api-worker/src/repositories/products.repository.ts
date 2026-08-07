import { DbClient } from "../db";
import { products } from "../db/schema";
import { eq } from "drizzle-orm";

export class ProductsRepository {
  constructor(private db: DbClient) {}

  async findAllActive() {
    return await this.db.select().from(products).where(eq(products.isActive, true));
  }

  async findBySlug(slug: string) {
    const list = await this.db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return list[0] || null;
  }

  async findByCode(code: string) {
    const list = await this.db.select().from(products).where(eq(products.code, code.toUpperCase())).limit(1);
    return list[0] || null;
  }

  async createProduct(data: {
    id?: string;
    storeId?: string;
    code: string;
    slug?: string;
    name: string;
    sport?: string;
    club?: string;
    description?: string;
    imageUrl?: string;
    basePrice: number;
    stockS?: number;
    stockM?: number;
    stockL?: number;
    stockXl?: number;
    stock2xl?: number;
  }) {
    const id = data.id || `p_${Date.now()}`;
    const storeId = data.storeId || "store_default";
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    await this.db.insert(products).values({
      id,
      storeId,
      code: data.code.toUpperCase(),
      slug,
      name: data.name,
      sport: data.sport || "Football",
      club: data.club || "Custom",
      description: data.description,
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
      basePrice: data.basePrice,
      stockS: data.stockS || 0,
      stockM: data.stockM || 0,
      stockL: data.stockL || 0,
      stockXl: data.stockXl || 0,
      stock2xl: data.stock2xl || 0,
      isActive: true,
    });

    return await this.findByCode(data.code);
  }
}
