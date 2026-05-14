export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

export function setToken(token: string | null) {
  if (token) localStorage.setItem("access_token", token);
  else localStorage.removeItem("access_token");
}

export function getToken() {
  return localStorage.getItem("access_token");
}

async function readErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") ?? "";

  // FastAPI часто возвращает {detail: "..."} или {detail: [...]}
  if (contentType.includes("application/json")) {
    const data = await res.json().catch(() => null) as any;

    if (typeof data?.detail === "string") return data.detail;

    // pydantic validation errors: detail: [{loc, msg, type}, ...]
    if (Array.isArray(data?.detail)) {
      const first = data.detail[0];
      if (first?.msg) return first.msg;
      return "Некорректные данные";
    }
  }

  // fallback
  const text = await res.text().catch(() => "");
  return text || `HTTP ${res.status}`;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await readErrorMessage(res);
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}