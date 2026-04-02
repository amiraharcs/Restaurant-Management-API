import type { OrderResponse } from "./waiterApi";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

// A list of all the types for response and request
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

export type AddMenuItemDto = {
  name: string;
  description: string;
  price: number;
  costToProduce: number;
  calories: number;
  ingredients: { name: string }[];
  allergens: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  meat: boolean;
  itemType: "FOOD" | "DESSERT" | "DRINK";
  available: boolean;
  imageUrl: string;
};

export type status = "PLACED" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
export type paymentStatus = "UNPAID" | "PAID"

export type EmployeeOrderInfoResponse = {
    orderTotal: number;
    numberOfItems: number;
    orderDateTime: string;
    status: status;
    paymentStatus: paymentStatus;
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

// Function to call for the menu for the manager specifically
export async function fetchManagerMenu(): Promise<MenuItemDto[]> {
  const res = await fetch(`${API_BASE}/api/menu/all`);
  if (!res.ok) throw new Error(`Menu fetch failed: ${res.status}`);
  return res.json();
}

// Function to call a menu item by its ID
export async function fetchMenuItemById(id: number): Promise<MenuItemDto> {
  const res = await fetch(`${API_BASE}/api/menu/menuItem/${id}`);

  if (!res.ok) {
    throw new Error(`Menu item fetch failed: ${res.status}`);
  }

  return res.json();
}

// Function to send details of a menu item to edit it
export async function editMenuItem(id: number, itemData: AddMenuItemDto): Promise<MenuItemDto> {
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

// Function to delete a menu item
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

// Function to send details of a new menu item to be added
export async function addMenuItem(itemData: AddMenuItemDto): Promise<MenuItemDto> {
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

// Function to call for all orders in the database
export async function fetchAllOrders(): Promise<OrderResponse[]> {
  const res = await fetch(`${API_BASE}/api/orders`);
  if (!res.ok) throw new Error(`Orders fetch failed: ${res.status}`);
  return res.json();
}

// Function to call for all employee data
export async function fetchEmployeeData(): Promise<EmployeeDataResponse[]> {
  const res = await fetch(`${API_BASE}/api/employee/data`);

  if (!res.ok) {
    throw new Error(`Failed to fetch employee data: ${res.status}`);
  }

  return res.json();
}