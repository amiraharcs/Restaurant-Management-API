-- =========================
-- Menu Items
-- =========================
CREATE TABLE IF NOT EXISTS menu_item (
  item_id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  calories INT CHECK (calories IS NULL OR calories >= 0),
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  cost_to_produce NUMERIC(10,2) NOT NULL CHECK (cost_to_produce >= 0),
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_vegetarian BOOLEAN NOT NULL DEFAULT FALSE,
  is_meat BOOLEAN NOT NULL DEFAULT FALSE,
  is_vegan BOOLEAN NOT NULL DEFAULT FALSE,
  is_gluten_free BOOLEAN NOT NULL DEFAULT FALSE,
  item_type TEXT NOT NULL CHECK (item_type IN ('FOOD', 'DESSERT', 'DRINK')),
  allergens TEXT
);

-- =========================
-- Ingredients
-- =========================
CREATE TABLE IF NOT EXISTS ingredient (
  ingredient_id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS menu_item_ingredient (
  menu_item_id BIGINT NOT NULL REFERENCES menu_item (item_id) ON DELETE CASCADE,
  ingredient_id BIGINT NOT NULL REFERENCES ingredient (ingredient_id) ON DELETE CASCADE,
  PRIMARY KEY (menu_item_id, ingredient_id)
);

-- =========================
-- Customers and Orders
-- =========================
CREATE TABLE IF NOT EXISTS customer (
  customer_id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone_number TEXT DEFAULT 'Not Provided'
);

CREATE TABLE IF NOT EXISTS customer_order (
  order_id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customer (customer_id),
  status TEXT NOT NULL DEFAULT 'PLACED' CHECK (status IN ('PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED')),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PAID')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW (),
  table_number INT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_item (
  order_id BIGINT NOT NULL REFERENCES customer_order (order_id) ON DELETE CASCADE,
  item_id BIGINT NOT NULL REFERENCES menu_item (item_id),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  PRIMARY KEY (order_id, item_id)
);

-- =========================
-- Staff Accounts
-- =========================
CREATE TABLE IF NOT EXISTS app_user (
  user_id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('WAITER', 'KITCHEN', 'MANAGER', 'ADMIN')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  on_shift BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW (),
  last_login TIMESTAMP
);

CREATE TABLE IF NOT EXISTS call_waiter_alert (
  id BIGSERIAL PRIMARY KEY,
  table_number INT NOT NULL CHECK (table_number > 0),
  customer_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW (),
  handled BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE customer_order
ADD COLUMN IF NOT EXISTS assigned_waiter_id BIGINT REFERENCES app_user (user_id) ON DELETE SET NULL;
