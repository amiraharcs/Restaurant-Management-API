-- =========================
-- MENU ITEMS (Food/Dessert/Drink)
-- =========================
CREATE TABLE IF NOT EXISTS menu_item (
  id BIGSERIAL PRIMARY KEY,
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
  available_customisations TEXT
);

-- =========================
-- INGREDIENTS
-- =========================
CREATE TABLE IF NOT EXISTS ingredient (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS menu_item_ingredient (
  menu_item_id BIGINT NOT NULL REFERENCES menu_item (id) ON DELETE CASCADE,
  ingredient_id BIGINT NOT NULL REFERENCES ingredient (id) ON DELETE CASCADE,
  PRIMARY KEY (menu_item_id, ingredient_id)
);

-- =========================
-- ALLERGENS
-- =========================
CREATE TABLE IF NOT EXISTS allergen (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS menu_item_allergen (
  menu_item_id BIGINT NOT NULL REFERENCES menu_item (id) ON DELETE CASCADE,
  allergen_id BIGINT NOT NULL REFERENCES allergen (id) ON DELETE CASCADE,
  PRIMARY KEY (menu_item_id, allergen_id)
);

-- =========================
-- CUSTOMERS
-- =========================
CREATE TABLE IF NOT EXISTS customer (
  customer_id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone_number TEXT DEFAULT 'Not Provided'
);

CREATE TABLE IF NOT EXISTS customer_order (
  order_id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customer (customer_id),
  order_time TIMESTAMP NOT NULL DEFAULT NOW (),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID'
);

CREATE TABLE IF NOT EXISTS order_item (
  order_id BIGINT NOT NULL REFERENCES customer_order (order_id) ON DELETE CASCADE,
  item_id BIGINT NOT NULL REFERENCES menu_item (id),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  custom_ingredients TEXT,
  PRIMARY KEY (order_id, item_id)
);

-- =========================
-- STAFF
-- =========================
CREATE TABLE IF NOT EXISTS waiter (
  waiter_id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  unavailable_reason TEXT DEFAULT NULL,
  CHECK (
    NOT (
      is_available = TRUE
      AND unavailable_reason IS NOT NULL
    )
  )
);

CREATE TABLE IF NOT EXISTS kitchen_staff (
  kitchen_id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Chef', 'Prep', 'Cleaner')),
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  unavailable_reason TEXT DEFAULT NULL,
  CHECK (
    NOT (
      is_available = TRUE
      AND unavailable_reason IS NOT NULL
    )
  )
);

CREATE TABLE IF NOT EXISTS kitchen_task (
  task_id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES customer_order (order_id) ON DELETE CASCADE,
  kitchen_id BIGINT NOT NULL REFERENCES kitchen_staff (kitchen_id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (
    task_type IN (
      'Cooking',
      'Cleaning',
      'Preparing',
      'Miscellaneous'
    )
  ),
  status TEXT NOT NULL CHECK (status IN ('In Progress', 'Ready')),
  started_at TIMESTAMP NOT NULL DEFAULT NOW (),
  finished_at TIMESTAMP DEFAULT NULL
);

-- =========================
-- LOGIN SYSTEM
-- =========================
CREATE TABLE IF NOT EXISTS app_user (
  user_id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('WAITER', 'KITCHEN', 'MANAGER', 'ADMIN')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
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

-- =========================
-- LINK STAFF TO LOGIN
-- =========================
ALTER TABLE waiter
ADD COLUMN IF NOT EXISTS user_id BIGINT UNIQUE REFERENCES app_user (user_id) ON DELETE SET NULL;

ALTER TABLE kitchen_staff
ADD COLUMN IF NOT EXISTS user_id BIGINT UNIQUE REFERENCES app_user (user_id) ON DELETE SET NULL;
