const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type CallWaiterAlert = {
  id: number;
  tableNumber: number;
  customerName: string;
  message: string;
  createdAt: string;
  handled: boolean;
};

// Function to create alerts from one waiter to another
export async function createCallWaiterAlert(data: {
  tableNumber: number;
  customerName: string;
  message: string;
}): Promise<CallWaiterAlert> {
  const res = await fetch(`${API_BASE}/api/alerts/call-waiter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Create alert failed: ${res.status}`);
  return res.json();
}

// Function to call for any alerts from waiters
export async function fetchCallWaiterAlerts(): Promise<CallWaiterAlert[]> {
  const res = await fetch(`${API_BASE}/api/alerts/call-waiter`);
  if (!res.ok) throw new Error(`Fetch alerts failed: ${res.status}`);
  return res.json();
}

// Function to dismiss a waiter alert
export async function markCallWaiterAlertHandled(id: number): Promise<CallWaiterAlert> {
  const res = await fetch(`${API_BASE}/api/alerts/call-waiter/${id}/handled`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(`Mark handled failed: ${res.status}`);
  return res.json();
}
