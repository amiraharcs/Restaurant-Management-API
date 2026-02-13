const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type MenuItemDto = {
  id?: number;
  name: string;
  description: string;
  price: number;
  calories: number;
  allergens: string;
};

export async function fetchMenu(): Promise<MenuItemDto[]> {
  const res = await fetch(`${API_BASE}/api/menu`);

  if (!res.ok) {
    throw new Error(`Menu fetch failed: ${res.status}`);
  }

  return res.json();
}

