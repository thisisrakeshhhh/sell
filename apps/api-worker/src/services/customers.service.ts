import { DbClient } from "../db";
import { CustomersRepository } from "../repositories/customers.repository";

export class CustomerService {
  private repo: CustomersRepository;

  constructor(db: DbClient) {
    this.repo = new CustomersRepository(db);
  }

  async getAllCustomers(storeId?: string) {
    return await this.repo.findAll(storeId);
  }

  async getCustomerByPhone(phone: string, storeId?: string) {
    return await this.repo.findByPhone(phone, storeId);
  }
}
