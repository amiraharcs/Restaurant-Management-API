const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type status = "PLACED" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";

export type OrderResponse = {
    id: string;
    status: status;
    createdAt: string;
    tableNumber: number;
    customerName: string;
    customerPhoneNumber: string;
    items: { menuItemId: number; name: string; quantity: number }[];
};

export type IngredientDto = {
  id?: number;
  name: string;
};

export type FilterDto = {
  id?: number;
  name?: string;
};

export type MenuItemDto = {
  id: number;
  name: string;
  description: string;
  price: number;
  costToProduce: number;
  calories: number;
  isAvailable: boolean;
  ingredients: string[];
  allergens: string[];
  filters: string[];
  image: string;
  itemType: "FOOD" | "DESSERT" | "DRINK";
};

export type MenuGrouped = Record<"FOOD" | "DESSERT" | "DRINK", MenuItemDto[]>;

export async function confirmOrder(id : number) {
    const res = await fetch(`${API_BASE}/api/orders/${id}/confirm`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        }
    });


    if (!res.ok) throw new Error(`Confirm order failed: ${res.status}`);
    return res.json();
}

export async function getOrder(id : number): Promise<OrderResponse> {
    const res = await fetch(`${API_BASE}/api/orders/${id}`);

    if (!res.ok) throw new Error(`Get order failed: ${res.status}`);
    return res.json();
}

export async function fetchWaiterMenu(): Promise<MenuItemDto[]> {
  const res = await fetch(`${API_BASE}/api/menu/all`);
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

export async function updateMenuItemAvailability(id: number, available: boolean): Promise<void> {
  const res = await fetch(`${API_BASE}/api/menu/menuItem/${id}/availability`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      {available: available}
    ),
  });

  if (!res.ok) {
    throw new Error(`Availability Update failed: ${res.status}`);
  }

}

export async function getAllOrders(): Promise<OrderResponse[]> {
    const res = await fetch(`${API_BASE}/api/orders`);

    if (!res.ok) throw new Error(`Get all orders failed: ${res.status}`);
    return res.json();
}

export async function acceptOrder(id: number) {
    const res = await fetch(`${API_BASE}/api/orders/${id}/accept`, { method: "PATCH" });
    if (!res.ok) throw new Error(`Accept order failed: ${res.status}`);
    return res.json();
}

export async function markReady(id: number) {
    const res = await fetch(`${API_BASE}/api/orders/${id}/ready`, { method: "PATCH" });
    if (!res.ok) throw new Error(`Mark ready failed: ${res.status}`);
    return res.json();
}

export async function getReadyOrders(): Promise<OrderResponse[]> {
    const res = await fetch(`${API_BASE}/api/orders/status/READY`);
    if (!res.ok) throw new Error(`Get ready orders failed: ${res.status}`);
    return res.json();
}

export async function deliverOrder(id: number) {
    const res = await fetch(`${API_BASE}/api/orders/${id}/deliver`, { method: "PATCH" });
    if (!res.ok) throw new Error(`Deliver order failed: ${res.status}`);
    return res.json();
}

export async function cancelOrder(id: number) {
    const res = await fetch(`${API_BASE}/api/orders/${id}/cancel`, { method: "PATCH" });
    if (!res.ok) throw new Error(`Cancel order failed: ${res.status}`);
    return res.json();
}
