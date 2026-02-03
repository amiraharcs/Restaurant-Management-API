-- =========================
-- MENU ITEMS (Food/Dessert/Drink)
-- =========================
CREATE TABLE IF NOT EXISTS menu_item (
  item_id       INT PRIMARY KEY,  -- 
  name          TEXT NOT NULL,

  
  ingredients   TEXT,
  calories      INT CHECK (calories IS NULL OR calories >= 0),
  price   INT NOT NULL CHECK (price >= 0),
  image_url     TEXT,
  is_available  BOOLEAN NOT NULL DEFAULT TRUE,
  is_vegetarian BOOLEAN NOT NULL DEFAULT FALSE,
  is_halal      BOOLEAN NOT NULL DEFAULT FALSE,

  -- separate FOOD vs DESSERT vs DRINK
  item_type     TEXT NOT NULL CHECK (item_type IN ('FOOD','DESSERT','DRINK'))
);

-- =========================
-- ALLERGENS
-- =========================
CREATE TABLE IF NOT EXISTS allergen (
  allergen_id   SERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS menu_item_allergen (
  item_id     INT NOT NULL REFERENCES menu_item(item_id) ON DELETE CASCADE,
  allergen_id INT NOT NULL REFERENCES allergen(allergen_id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, allergen_id)
);