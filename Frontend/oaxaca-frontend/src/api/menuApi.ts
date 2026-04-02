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

// Function to call for all menu items inside the menu
export async function fetchMenu(): Promise<MenuGrouped> {
  const res = await fetch(`${API_BASE}/api/menu`);
  if (!res.ok) throw new Error(`Menu fetch failed: ${res.status}`);
  return res.json();
}

