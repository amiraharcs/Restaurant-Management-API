import type { OrderResponse } from "./waiterApi";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type IngredientDto = {
  id?: number;
  name: string;
};

export type FilterDto = {
  id?: number;
  name?: string;
};

export type MenuItemDto = {
  id?: number;
  name: string;
  description: string;
  price: number;
  costToProduce: number;
  calories: number;
  available: boolean;
  ingredients: IngredientDto[];
  allergens: String;
  vegetarian: Boolean;
  vegan: Boolean;
  glutenFree: Boolean;
  meat: Boolean;
  imageUrl: string;
  itemType: "FOOD" | "DESSERT" | "DRINK";
};

export type status = "PLACED" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";

export type EmployeeOrderInfoResponse = {
    orderTotal: number;
    numberOfItems: number;
    orderDateTime: string;
    status: status;
};

export type EmployeeDataResponse = {
    employeeId: number;
    username: string;
    role: string;
    active: boolean;
    onShift: boolean;

    totalSales: number;
    totalOrders: number;
    totalItemsSold: number;

    employeeOrders: EmployeeOrderInfoResponse[];
};

export async function fetchManagerrMenu(): Promise<MenuItemDto[]> {
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

export async function addMenuItem(itemData: MenuItemDto): Promise<MenuItemDto> {
  const res = await fetch(`${API_BASE}/api/menu/menuItem/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!res.ok) {
    throw new Error(`Menu item add failed: ${res.status}`);
  }

  return res.json();
}

export async function fetchAllOrders(): Promise<OrderResponse[]> {
  const res = await fetch(`${API_BASE}/api/orders`);
  if (!res.ok) throw new Error(`Orders fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchEmployeeData(): Promise<EmployeeDataResponse[]> {
  const res = await fetch(`${API_BASE}/api/employee/data`);

  if (!res.ok) {
    throw new Error(`Failed to fetch employee data: ${res.status}`);
  }

  return res.json();
}