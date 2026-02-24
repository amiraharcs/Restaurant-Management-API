const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function placeOrder(order: any) {
    const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order)
    });
    
    if (!res.ok) throw new Error(`Unable to place order: ${res.status}`);
    return res.json();
}