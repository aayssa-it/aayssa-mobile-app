import { API_URL, DEMO_MODE } from './config';
import { demoApi } from './demo';
import { getAccessToken, refreshSession } from './session';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Options = {
  method?: 'GET' | 'POST' | 'PATCH';
  body?: unknown;
  /** Send the signed-in member's token. */
  auth?: boolean;
};

/** Calls the AAYSSA API. Throws ApiError with the server's message on failure. */
export async function api<T>(path: string, { method = 'GET', body, auth = false }: Options = {}): Promise<T> {
  if(DEMO_MODE) {
    const data = (await demoApi(path, { method, body })) as { success?: boolean; message?: string };
    if(data.success === false) throw new ApiError(data.message ?? 'Something went wrong.', 400);
    return data as T;
  }
  const send = async (token: string | null) => {
    const headers: Record<string, string> = { Accept: 'application/json', 'X-Client': 'mobile' };
    if(body !== undefined) headers['Content-Type'] = 'application/json';
    if(token) headers.Authorization = `Bearer ${token}`;
    try {
      return await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new ApiError('Check your internet connection and try again.', 0);
    }
  };

  let token = auth ? await getAccessToken() : null;
  if(auth && !token) throw new ApiError('Please sign in.', 401);

  let res = await send(token);
  if(auth && res.status === 401) {
    token = (await refreshSession())?.accessToken ?? null;
    if(!token) throw new ApiError('Please sign in again.', 401);
    res = await send(token);
  }

  const data = await res.json().catch(() => null);
  if(!res.ok || !data || data.success === false) {
    const message = data && typeof data.message === 'string' ? data.message : 'Something went wrong. Please try again.';
    throw new ApiError(message, res.status);
  }
  return data as T;
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}