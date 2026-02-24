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

export async function confirmOrder(id : number) {
    const res = await fetch(`${API_BASE}/api/orders/${id}/confirm`);

    if (!res.ok) throw new Error(`Confirm order failed: ${res.status}`);
}

export async function getOrder(id : number): Promise<OrderResponse[]> {
    const res = await fetch(`${API_BASE}/api/orders/${id}`);

    if (!res.ok) throw new Error(`Confirm order failed: ${res.status}`);
    return res.json();
}