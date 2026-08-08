CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY,
  subdomain TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#09090b',
  secondary_color TEXT DEFAULT '#18181b',
  accent_color TEXT DEFAULT '#10b981',
  phone TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  upi_id TEXT NOT NULL,
  address TEXT,
  instagram_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sport TEXT NOT NULL DEFAULT 'Football',
  club TEXT,
  season TEXT,
  tags TEXT,
  description TEXT,
  image_url TEXT,
  base_price REAL NOT NULL,
  discount_price REAL,
  stock_s INTEGER NOT NULL DEFAULT 0,
  stock_m INTEGER NOT NULL DEFAULT 0,
  stock_l INTEGER NOT NULL DEFAULT 0,
  stock_xl INTEGER NOT NULL DEFAULT 0,
  stock_2xl INTEGER NOT NULL DEFAULT 0,
  is_featured INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  version INTEGER NOT NULL DEFAULT 1,
  seo_title TEXT,
  seo_description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL UNIQUE,
  name TEXT,
  instagram_handle TEXT,
  source TEXT NOT NULL DEFAULT 'Instagram',
  default_address TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS draft_orders (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  selected_sku TEXT,
  custom_name TEXT,
  custom_number TEXT,
  size TEXT,
  shipping_address TEXT,
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS conversation_sessions (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  current_state TEXT NOT NULL DEFAULT 'WAITING_SKU',
  current_draft_order_id TEXT,
  context TEXT,
  last_activity TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS customer_messages (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  direction TEXT NOT NULL DEFAULT 'incoming',
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  whatsapp_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  size TEXT NOT NULL,
  custom_name TEXT,
  custom_number TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount REAL NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'upi',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'NEW',
  version INTEGER NOT NULL DEFAULT 1,
  confirmation_called INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_timeline_events (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO stores (id, subdomain, name, phone, whatsapp_number, upi_id) VALUES ('store_default', 'jerseyflow', 'JerseyFlow Store', '+919999999999', '+919999999999', 'jerseyflow@upi');

INSERT OR IGNORE INTO products (id, store_id, code, slug, name, base_price, stock_s, stock_m, stock_l, stock_xl, stock_2xl) VALUES ('p_1', 'store_default', 'MU-18', 'manchester-united-home-24-25', 'Manchester United Home 24/25', 999, 10, 15, 20, 12, 5);
INSERT OR IGNORE INTO products (id, store_id, code, slug, name, base_price, stock_s, stock_m, stock_l, stock_xl, stock_2xl) VALUES ('p_1b', 'store_default', 'MU-001', 'manchester-united-away-24-25', 'Manchester United Away 24/25', 999, 10, 15, 20, 12, 5);
INSERT OR IGNORE INTO products (id, store_id, code, slug, name, base_price, stock_s, stock_m, stock_l, stock_xl, stock_2xl) VALUES ('p_2', 'store_default', 'BAR-10', 'fc-barcelona-away-24-25', 'FC Barcelona Away 24/25', 1099, 12, 2, 8, 0, 4);
INSERT OR IGNORE INTO products (id, store_id, code, slug, name, base_price, stock_s, stock_m, stock_l, stock_xl, stock_2xl) VALUES ('p_2b', 'store_default', 'BAR-004', 'fc-barcelona-home-24-25', 'FC Barcelona Home 24/25', 1099, 12, 2, 8, 5, 4);
INSERT OR IGNORE INTO products (id, store_id, code, slug, name, base_price, stock_s, stock_m, stock_l, stock_xl, stock_2xl) VALUES ('p_3', 'store_default', 'RMA-07', 'real-madrid-home-24-25', 'Real Madrid Home 24/25', 999, 5, 5, 5, 5, 5);
INSERT OR IGNORE INTO products (id, store_id, code, slug, name, base_price, stock_s, stock_m, stock_l, stock_xl, stock_2xl) VALUES ('p_3b', 'store_default', 'RMA-007', 'real-madrid-third-24-25', 'Real Madrid CR7 Edition 24/25', 999, 5, 5, 5, 5, 5);
INSERT OR IGNORE INTO products (id, store_id, code, slug, name, base_price, stock_s, stock_m, stock_l, stock_xl, stock_2xl) VALUES ('p_4', 'store_default', 'IND-18', 'team-india-t20-champions', 'Team India T20 Champions Kit', 899, 10, 10, 10, 10, 10);
INSERT OR IGNORE INTO products (id, store_id, code, slug, name, base_price, stock_s, stock_m, stock_l, stock_xl, stock_2xl) VALUES ('p_4b', 'store_default', 'IND-002', 'team-india-odi-kit', 'Team India Jersey 2026', 899, 10, 10, 10, 10, 10);
