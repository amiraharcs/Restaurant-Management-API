const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type MenuItemDto = {
  id: number;
  name: string;
  description: string;
  price: number;
  calories: number;
  isAvailable: boolean;
  ingredients: string[];
  allergens: string[];
  filters: string[];
  image: string;
  itemType: "FOOD" | "DESSERT" | "DRINK";
};

export type MenuGrouped = Record<"FOOD" | "DESSERT" | "DRINK", MenuItemDto[]>;

export async function fetchMenu(): Promise<MenuGrouped> {
  const res = await fetch(`${API_BASE}/api/menu`);
  if (!res.ok) throw new Error(`Menu fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchMenuItemById(id: number): Promise<MenuItemDto> {
  const res = await fetch(`${API_BASE}/api/menu/menuItem/${id}`);

  if (!res.ok) {
    throw new Error(`Menu item fetch failed: ${res.status}`);
  }

  return res.json();
}
