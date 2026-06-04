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
    const data: unknown = await res.json().catch(() => null);

    if (
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      typeof data.detail === "string"
    ) {
      return data.detail;
    }

    // pydantic validation errors: detail: [{loc, msg, type}, ...]
    if (
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      Array.isArray(data.detail)
    ) {
      const first = data.detail[0];
      if (
        typeof first === "object" &&
        first !== null &&
        "msg" in first &&
        typeof first.msg === "string"
      ) {
        return first.msg;
      }
      return "Некорректные данные";
    }
  }

  // fallback
  const text = await res.text().catch(() => "");
  return text || `HTTP ${res.status}`;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, {
    method: "GET",
    headers: authHeaders(),
  });
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: "Bearer " + token } : {};
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
  });

  if (!res.ok) {
    const msg = await readErrorMessage(res);
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}