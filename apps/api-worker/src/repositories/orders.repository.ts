import { DbClient } from "../db";
import { orders, customers, orderTimelineEvents, products } from "../db/schema";
import { eq, and } from "drizzle-orm";

export class OrdersRepository {
  constructor(private db: DbClient) {}

  async findAll() {
    return await this.db.select().from(orders);
  }

  async findByOrderNumber(orderNumber: string) {
    const cleanNumber = orderNumber.toUpperCase().replace("#", "");
    const list = await this.db.select().from(orders).where(eq(orders.orderNumber, cleanNumber)).limit(1);
    return list[0] || null;
  }

  async findById(orderId: string) {
    const list = await this.db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    return list[0] || null;
  }

  async createOrderWithCustomer(orderData: any, customerData: any) {
    const storeId = orderData.storeId || "store_default";

    // 1. STOCK GUARD: Fetch product to check size stock
    const product = (
      await this.db
        .select()
        .from(products)
        .where(and(eq(products.id, orderData.productId), eq(products.storeId, storeId)))
        .limit(1)
    )[0];

    if (!product) {
      throw new Error(`Product ${orderData.productId} not found`);
    }

    const size = (orderData.size || "L").toUpperCase();
    let currentStock = 0;
    if (size === "S") currentStock = product.stockS;
    else if (size === "M") currentStock = product.stockM;
    else if (size === "L") currentStock = product.stockL;
    else if (size === "XL") currentStock = product.stockXl;
    else if (size === "2XL" || size === "XXL") currentStock = product.stock2xl;

    if (currentStock < (orderData.quantity || 1)) {
      throw new Error(`Insufficient stock for size ${size}. Available: ${currentStock}`);
    }

    // 2. Find or create customer
    let existingCustomer = (
      await this.db
        .select()
        .from(customers)
        .where(eq(customers.phoneNumber, customerData.phoneNumber))
        .limit(1)
    )[0];

    let customerId = existingCustomer?.id;

    if (!customerId) {
      customerId = crypto.randomUUID();
      await this.db.insert(customers).values({
        id: customerId,
        storeId,
        phoneNumber: customerData.phoneNumber,
        name: customerData.name,
        instagramHandle: customerData.instagramHandle,
        source: "WhatsApp",
        defaultAddress: customerData.shippingAddress,
      });
    }

    // 3. Insert Order
    const orderId = crypto.randomUUID();
    const orderNumber = `JF-${Math.floor(10000 + Math.random() * 90000)}`;

    await this.db.insert(orders).values({
      id: orderId,
      storeId,
      orderNumber,
      customerId,
      productId: orderData.productId,
      size,
      customName: orderData.customName,
      customNumber: orderData.customNumber,
      quantity: orderData.quantity || 1,
      totalAmount: orderData.totalAmount || product.basePrice,
      customerPhone: customerData.phoneNumber,
      shippingAddress: customerData.shippingAddress || "N/A",
      paymentMethod: orderData.paymentMethod || "upi",
      status: "NEW",
      version: 1,
      notes: orderData.notes,
    });

    // 4. Update Inventory Stock on Product
    const updatedStockField: Record<string, number> = {};
    if (size === "S") updatedStockField.stockS = Math.max(0, product.stockS - 1);
    else if (size === "M") updatedStockField.stockM = Math.max(0, product.stockM - 1);
    else if (size === "L") updatedStockField.stockL = Math.max(0, product.stockL - 1);
    else if (size === "XL") updatedStockField.stockXl = Math.max(0, product.stockXl - 1);
    else if (size === "2XL" || size === "XXL") updatedStockField.stock2xl = Math.max(0, product.stock2xl - 1);

    await this.db
      .update(products)
      .set(updatedStockField)
      .where(eq(products.id, product.id));

    // 5. Insert Timeline Event
    await this.db.insert(orderTimelineEvents).values({
      id: crypto.randomUUID(),
      storeId,
      orderId,
      eventType: "ORDER_CREATED",
      title: "Order Created",
      description: `Order #${orderNumber} initiated via WhatsApp Customizer`,
    });

    return { orderId, orderNumber };
  }
}
