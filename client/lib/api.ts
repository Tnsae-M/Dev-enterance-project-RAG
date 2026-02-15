const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000";

const defaultOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

export function getApiBase(): string {
  return API_BASE;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; ok: boolean; status: number; error?: { status: string; message: string } }> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  try {
    const res = await fetch(url, { ...defaultOptions, ...options });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: {
          status: body.status ?? "failed",
          message: body.message ?? res.statusText,
        },
      };
    }
    return { data: body as T, ok: true, status: res.status };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: {
        status: "error",
        message: "Server is down. Please try again later.",
      },
    };
  }
}


export async function apiPost<T = unknown>(
  path: string,
  body: object
): Promise<{ data?: T; ok: boolean; status: number; error?: { status: string; message: string } }> {
  return apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
