import { DbClient } from "../db";
import { ProductsRepository } from "../repositories/products.repository";

export class ProductService {
  private repo: ProductsRepository;

  constructor(db: DbClient) {
    this.repo = new ProductsRepository(db);
  }

  async getCatalog() {
    return await this.repo.findAllActive();
  }

  async getBySlug(slug: string) {
    return await this.repo.findBySlug(slug);
  }

  async getByCode(code: string) {
    return await this.repo.findByCode(code);
  }
}
