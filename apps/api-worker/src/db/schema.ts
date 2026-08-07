import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1. STORES TABLE (SaaS Multi-Tenant Anchor)
export const stores = sqliteTable("stores", {
  id: text("id").primaryKey(), // ULID e.g. 01K1D7TYQK3M4X...
  subdomain: text("subdomain").notNull().unique(), // e.g. 'realmadrid' -> realmadrid.jerseyflow.in
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  primaryColor: text("primary_color").default("#09090b"),
  secondaryColor: text("secondary_color").default("#18181b"),
  accentColor: text("accent_color").default("#10b981"),
  phone: text("phone").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  upiId: text("upi_id").notNull(),
  address: text("address"),
  instagramUrl: text("instagram_url"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// 2. SUBSCRIPTIONS TABLE (SaaS Multi-Tenant Billing)
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(), // ULID
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  planId: text("plan_id").notNull().default("STARTER"), // STARTER, GROWTH, PRO
  status: text("status").notNull().default("active"), // active, past_due, cancelled
  monthlyOrdersLimit: integer("monthly_orders_limit").notNull().default(100),
  currentMonthOrders: integer("current_month_orders").notNull().default(0),
  renewsAt: text("renews_at").default(sql`(datetime('now', '+30 days'))`),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// 3. ADMINS TABLE
export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// 4. PRODUCTS TABLE
export const products = sqliteTable("products", {
  id: text("id").primaryKey(), // ULID
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(), // Stable SKU e.g. 'MU-001'
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  sport: text("sport").notNull().default("Football"),
  club: text("club"),
  season: text("season"),
  tags: text("tags"),
  description: text("description"),
  imageUrl: text("image_url"),
  basePrice: real("base_price").notNull(),
  discountPrice: real("discount_price"),
  stockS: integer("stock_s").notNull().default(0),
  stockM: integer("stock_m").notNull().default(0),
  stockL: integer("stock_l").notNull().default(0),
  stockXl: integer("stock_xl").notNull().default(0),
  stock2xl: integer("stock_2xl").notNull().default(0),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  version: integer("version").notNull().default(1),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
  deletedAt: text("deleted_at"),
});

// 5. PRODUCT MEDIA TABLE
export const productMedia = sqliteTable("product_media", {
  id: text("id").primaryKey(), // ULID
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  r2Key: text("r2_key").notNull(),
  publicUrl: text("public_url").notNull(),
  width: integer("width"),
  height: integer("height"),
  mimeType: text("mime_type").default("image/webp"),
  fileSize: integer("file_size"),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// 6. CUSTOMERS TABLE
export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(), // ULID
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  phoneNumber: text("phone_number").notNull().unique(),
  name: text("name"),
  instagramHandle: text("instagram_handle"),
  source: text("source").notNull().default("Instagram"),
  defaultAddress: text("default_address"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// 7. DRAFT ORDERS TABLE
export const draftOrders = sqliteTable("draft_orders", {
  id: text("id").primaryKey(), // ULID
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id, { onDelete: "set null" }),
  selectedSku: text("selected_sku"),
  customName: text("custom_name"),
  customNumber: text("custom_number"),
  size: text("size"),
  shippingAddress: text("shipping_address"),
  status: text("status").notNull().default("IN_PROGRESS"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// 8. CONVERSATION SESSIONS TABLE
export const conversationSessions = sqliteTable("conversation_sessions", {
  id: text("id").primaryKey(), // ULID
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  currentState: text("current_state").notNull().default("WAITING_SKU"),
  currentDraftOrderId: text("current_draft_order_id"),
  context: text("context"),
  lastActivity: text("last_activity").default(sql`(datetime('now'))`),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// 9. CUSTOMER MESSAGES TABLE
export const customerMessages = sqliteTable("customer_messages", {
  id: text("id").primaryKey(), // ULID
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  direction: text("direction").notNull().default("incoming"),
  message: text("message").notNull(),
  messageType: text("message_type").notNull().default("text"),
  whatsappMessageId: text("whatsapp_message_id"),
  status: text("status").notNull().default("sent"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// 10. ORDERS TABLE
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(), // ULID
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  orderNumber: text("order_number").notNull().unique(),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "restrict" }),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  size: text("size").notNull(),
  customName: text("custom_name"),
  customNumber: text("custom_number"),
  quantity: integer("quantity").notNull().default(1),
  totalAmount: real("total_amount").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  paymentMethod: text("payment_method").notNull().default("upi"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  status: text("status").notNull().default("NEW"),
  version: integer("version").notNull().default(1),
  confirmationCalled: integer("confirmation_called", { mode: "boolean" }).notNull().default(false),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// 11. PAYMENTS TABLE
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(), // ULID
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  screenshotUrl: text("screenshot_url"),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// 12. ORDER TIMELINE EVENTS TABLE
export const orderTimelineEvents = sqliteTable("order_timeline_events", {
  id: text("id").primaryKey(), // ULID
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// 13. AUDIT LOGS TABLE
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(), // ULID
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id").notNull(),
  performedBy: text("performed_by"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});
