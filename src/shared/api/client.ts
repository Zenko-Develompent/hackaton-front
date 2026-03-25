// shared/api/client.ts - добавьте интеграцию с уведомлениями
import { API_V1 } from '@/shared/config/api';
import { ApiError, type ApiErrorShape } from './types';

// Добавляем тип для обработчика уведомлений
type NotificationHandler = {
  onSuccess?: (message: string, data?: any) => void;
  onError?: (message: string, error?: any) => void;
};

// ---------------- TYPES ----------------
type RefreshResult = { accessToken: string; refreshToken?: string } | null;

export type ApiClientOptions = {
  fetchImpl: typeof fetch;
  baseUrl?: string;
  getAccessToken?: () => string | null;
  refresh?: () => Promise<RefreshResult>;
  onAuthFailure?: () => void;
  onNotification?: (type: 'success' | 'error', message: string, data?: any) => void; // Добавляем обработчик уведомлений
  nextConfig?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export type RequestOptions = {
  auth?: boolean;
  retry?: boolean;
  serverContext?: boolean;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  headers?: Record<string, string>;
  signal?: AbortSignal;
  showNotification?: boolean | NotificationHandler; // Настройка уведомлений для конкретного запроса
};

export type ApiClient = {
  request<T>(path: string, init?: RequestInit, opt?: RequestOptions): Promise<T>;
  get<T>(path: string, opt?: RequestOptions): Promise<T>;
  post<T>(path: string, body?: unknown, opt?: RequestOptions): Promise<T>;
  put<T>(path: string, body?: unknown, opt?: RequestOptions): Promise<T>;
  del<T>(path: string, opt?: RequestOptions): Promise<T>;
};

// ---------------- STATE ----------------
let client: ApiClient | null = null;
let optionsRef: ApiClientOptions | null = null;
let refreshPromise: Promise<RefreshResult> | null = null;

// ---------------- HELPERS ----------------
function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Функция для отправки уведомлений
function sendNotification(
  type: 'success' | 'error',
  message: string,
  data?: any
) {
  if (optionsRef?.onNotification) {
    optionsRef.onNotification(type, message, data);
  }
}

async function handleResponse<T>(
  res: Response,
  showNotification?: boolean | NotificationHandler,
  requestData?: any
): Promise<T> {
  if (res.status === 204) {
    if (showNotification) {
      const notificationConfig = typeof showNotification === 'object' ? showNotification : {};
      const message = notificationConfig.onSuccess 
        ? undefined 
        : 'Operation completed successfully';
      
      if (notificationConfig.onSuccess) {
        notificationConfig.onSuccess('Operation completed successfully', undefined);
      } else if (message) {
        sendNotification('success', message);
      }
    }
    return undefined as T;
  }

  const text = await res.text();
  const data = text ? safeJson(text) : undefined;

  if (!res.ok) {
    const errorData = data as any;
    const msg =
      (errorData?.error || errorData?.message) ||
      res.statusText ||
      'Request failed';

    // Отправляем уведомление об ошибке
    if (showNotification) {
      const notificationConfig = typeof showNotification === 'object' ? showNotification : {};
      
      if (notificationConfig.onError) {
        notificationConfig.onError(msg, errorData);
      } else {
        sendNotification('error', msg);
      }
    }

    throw new ApiError(String(msg), res.status, data as ApiErrorShape);
  }

  // Отправляем уведомление об успехе
  if (showNotification && res.ok) {
    const notificationConfig = typeof showNotification === 'object' ? showNotification : {};
    const message = notificationConfig.onSuccess 
      ? undefined 
      : 'Request completed successfully';
    
    if (notificationConfig.onSuccess) {
      notificationConfig.onSuccess(message || 'Request completed successfully', data);
    } else if (message) {
      sendNotification('success', message);
    }
  }

  return data as T;
}

async function getToken(): Promise<string | null> {
  if (!optionsRef) return null;
  return optionsRef.getAccessToken?.() ?? null;
}

async function refreshToken(): Promise<RefreshResult> {
  if (!optionsRef?.refresh) return null;

  if (!refreshPromise) {
    refreshPromise = optionsRef.refresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

// ---------------- CORE REQUEST ----------------
async function baseRequest<T>(
  fetchImpl: typeof fetch,
  base: string,
  path: string,
  init: RequestInit = {},
  opt: RequestOptions = {}
): Promise<T> {
  const url = path.startsWith('http')
    ? path
    : `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = new Headers(init.headers);

  if (opt.headers) {
    Object.entries(opt.headers).forEach(([k, v]) => headers.set(k, v));
  }

  // AUTH
  if (opt.auth) {
    const token = await getToken();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else if (!opt.retry) {
      optionsRef?.onAuthFailure?.();
      if (opt.showNotification) {
        sendNotification('error', 'No authentication token');
      }
      throw new ApiError('No authentication token', 401);
    }
  }

  // BODY
  const hasBody = init.body !== undefined && init.body !== null;

  if (hasBody && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (init.body instanceof FormData) {
    headers.delete('Content-Type');
  }

  headers.set('Accept', 'application/json');

  const nextConfig = {
    ...optionsRef?.nextConfig,
    ...opt.next,
  };

  const fetchOptions: RequestInit = {
    ...init,
    headers,
    signal: opt.signal,
    ...(Object.keys(nextConfig).length > 0 && { next: nextConfig }),
  };

  let res = await fetchImpl(url, fetchOptions);

  // REFRESH FLOW
  if (res.status === 401 && opt.auth && !opt.retry) {
    const refreshed = await refreshToken();

    if (refreshed?.accessToken) {
      const retryHeaders = new Headers(headers);
      retryHeaders.set('Authorization', `Bearer ${refreshed.accessToken}`);

      return baseRequest<T>(fetchImpl, base, path, init, {
        ...opt,
        retry: true,
        headers: Object.fromEntries(retryHeaders.entries()),
      });
    }

    optionsRef?.onAuthFailure?.();
    if (opt.showNotification) {
      sendNotification('error', 'Session expired. Please login again.');
    }
    throw new ApiError('Unauthorized', 401);
  }

  return handleResponse<T>(res, opt.showNotification, init.body);
}

// ---------------- INIT ----------------
export function initApiClient(options: ApiClientOptions): void {
  optionsRef = options;

  const base = options.baseUrl ?? API_V1;
  const fetchImpl = options.fetchImpl;

  client = {
    request: (p, i, o) => baseRequest(fetchImpl, base, p, i, o),
    get: (p, o) => baseRequest(fetchImpl, base, p, { method: 'GET' }, o),
    post: (p, body, o) =>
      baseRequest(fetchImpl, base, p, {
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body),
      }, o),
    put: (p, body, o) =>
      baseRequest(fetchImpl, base, p, {
        method: 'PUT',
        body: body instanceof FormData ? body : JSON.stringify(body),
      }, o),
    del: (p, o) => baseRequest(fetchImpl, base, p, { method: 'DELETE' }, o),
  };
}

// ---------------- API ACCESS ----------------
export function api(): ApiClient {
  if (!client) throw new Error('API not initialized');
  return client;
}

// ---------------- RESET ----------------
export function resetApiClient(): void {
  client = null;
  optionsRef = null;
  refreshPromise = null;
}