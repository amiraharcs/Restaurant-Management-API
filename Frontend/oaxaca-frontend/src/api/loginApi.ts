const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type LoginRequest = {
    username: string;
    password: string;
};

export type LoginResponse = {
    username: string;
    role: string;
};

export async function postLogin(requestData : LoginRequest): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
    });
    if (!res.ok) throw new Error(`Login post failed: ${res.status}`);
    return res.json();
}
