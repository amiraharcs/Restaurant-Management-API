const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type status = "new" | "preparing" | "ready";

export type OrderResponse = {
    orderId: string;
    customerName: string;
    tableNo: number;
    placedAt: string;
    status: status;
    items: { name: string; qty: number }[];
};

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

export async function confirmOrder(id : number) {
    const res = await fetch(`${API_BASE}/api/orders/${id}/confirm`);

    if (!res.ok) throw new Error(`Confirm order failed: ${res.status}`);
}

export async function getOrder(id : number): Promise<OrderResponse[]> {
    const res = await fetch(`${API_BASE}/api/orders/${id}`);

    if (!res.ok) throw new Error(`Confirm order failed: ${res.status}`);
    return res.json();
}

export async function fetchMenuItemById(id: number): Promise<MenuItemDto> {
  const res = await fetch(`${API_BASE}/api/menu/menuItem/${id}`);

  if (!res.ok) {
    throw new Error(`Menu item fetch failed: ${res.status}`);
  }

  return res.json();
}

export async function editMenuItem(id: number, itemData: MenuItemDto): Promise<MenuItemDto> {
  const res = await fetch(`${API_BASE}/api/menu/menuItem/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!res.ok) {
    throw new Error(`Menu item edit failed: ${res.status}`);
  }

  return res.json();
}

export async function deleteMenuItem(id: number): Promise<void> {
  const res = await fetch(
    `${API_BASE}/api/menu/menuItem/delete/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error(`Menu item delete failed: ${res.status}`);
  }
}

