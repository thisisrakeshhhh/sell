import { execSync } from "child_process";

console.log("🌱 Populating JerseyFlow Cloudflare D1 local database seed data...");

const seedSql = `
INSERT INTO stores (id, name, phone, whatsapp_number, upi_id, address) VALUES
('store_default', 'JerseyFlow Official Store', '+919999999999', '+919999999999', 'jerseyflow@upi', 'Indiranagar, Bengaluru');

INSERT INTO products (id, store_id, code, slug, name, sport, club, base_price, stock_s, stock_m, stock_l, stock_xl, stock_2xl, is_featured) VALUES
('p_1', 'store_default', 'MU-001', 'manchester-united-home-24-25', 'Manchester United Home 24/25', 'Football', 'Manchester United', 999, 8, 14, 6, 2, 0, 1),
('p_2', 'store_default', 'BAR-004', 'fc-barcelona-away-24-25', 'FC Barcelona Away 24/25', 'Football', 'FC Barcelona', 1099, 12, 2, 8, 0, 4, 1),
('p_3', 'store_default', 'RMA-007', 'real-madrid-home-24-25', 'Real Madrid Home 24/25', 'Football', 'Real Madrid', 999, 0, 0, 0, 1, 0, 1),
('p_4', 'store_default', 'IND-002', 'team-india-t20-champions', 'Team India T20 Champions Kit', 'Cricket', 'India Cricket', 899, 10, 15, 20, 8, 5, 1);

INSERT INTO customers (id, store_id, phone_number, name, instagram_handle, source) VALUES
('c_1', 'store_default', '+919876543210', 'Rohan Sharma', '@rohan_sports', 'Instagram'),
('c_2', 'store_default', '+919812345678', 'Ananya Iyer', '@ananya_fcb', 'WhatsApp');

INSERT INTO orders (id, store_id, order_number, customer_id, product_id, size, custom_name, custom_number, total_amount, customer_phone, shipping_address, status) VALUES
('o_1', 'store_default', 'JF-10024', 'c_1', 'p_1', 'L', 'BECKHAM', '7', 999, '+919876543210', 'Indiranagar, Bengaluru', 'WAITING_CALL'),
('o_2', 'store_default', 'JF-10023', 'c_2', 'p_2', 'M', 'MESSI', '10', 1099, '+919812345678', 'Sector 62, Noida', 'WAITING_PAYMENT');
`;

console.log("✅ Seed SQL prepared successfully!");
