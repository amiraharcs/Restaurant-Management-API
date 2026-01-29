-- Desserts menu table
CREATE TABLE IF NOT EXISTS desserts (
  dessert_id      INT PRIMARY KEY,                 --
  name            TEXT NOT NULL,
  description     TEXT,
  calories        INT CHECK (calories IS NULL OR calories >= 0),
  price     INT NOT NULL CHECK (price >= 0),
  is_available    BOOLEAN NOT NULL DEFAULT TRUE,
  image_url       TEXT
);
