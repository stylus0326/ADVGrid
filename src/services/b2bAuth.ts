const API_BASE = '/be-crm';
const SESSION_STORAGE_KEY = 'agv_b2b_session_v1';

export interface AuthUserInfo {
  UserId: number;
  UserCode: string;
  FullName?: string;
  UserFullname?: string;
  Email?: string;
  UserEmail?: string;
  PartnerId?: number;
  IsSupperAdmin?: boolean;
  IsSuperAdmin?: boolean;
  IsAdmin?: boolean;
  Roles?: string[];
  [key: string]: unknown;
}

export interface AuthSession {
  SessionKey: string;
  UserInfo: AuthUserInfo;
  Requires2FA?: boolean;
  ChallengeId?: string;
  ExpiresInSec?: number;
}

export class B2bApiError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.name = 'B2bApiError';
    this.status = status;
  }
}

let memorySession: AuthSession | null = loadStoredSession();
let refreshPromise: Promise<boolean> | null = null;
const sessionListeners = new Set<() => void>();

function loadStoredSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (parsed && typeof parsed.SessionKey === 'string' && parsed.SessionKey) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function emitSessionChange() {
  sessionListeners.forEach((listener) => listener());
}

export function subscribeAuthSession(listener: () => void): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

export function getAuthSession(): AuthSession | null {
  return memorySession;
}

export function saveAuthSession(session: AuthSession) {
  memorySession = session;
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore storage limits
  }
  emitSessionChange();
}

export function clearAuthSession() {
  memorySession = null;
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
  emitSessionChange();
}

function createRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `gridv3-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function extractMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const rec = payload as Record<string, unknown>;
    const msg = rec.Message ?? rec.message ?? rec.error;
    if (typeof msg === 'string' && msg.trim()) {
      return msg.trim();
    }
  }
  return fallback;
}

async function tryRefreshSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const prev = memorySession;
    try {
      const body: Record<string, unknown> = {};
      if (prev?.UserInfo?.UserId) {
        body.UserId = prev.UserInfo.UserId;
      }
      const res = await fetch(`${API_BASE}/api/Auth/RefreshToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Id': createRequestId(),
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        clearAuthSession();
        return false;
      }
      const json = (await res.json()) as Record<string, unknown>;
      const data =
        json && typeof json === 'object' && 'Data' in json && json.Data && typeof json.Data === 'object'
          ? (json.Data as Record<string, unknown>)
          : json;
      const sessionKey = String(data?.SessionKey ?? '');
      if (!sessionKey) {
        clearAuthSession();
        return false;
      }
      const nextUser = ((data?.UserInfo as AuthUserInfo | undefined) ?? prev?.UserInfo ?? {
        UserId: 0,
        UserCode: '',
      }) as AuthUserInfo;
      saveAuthSession({
        SessionKey: sessionKey,
        UserInfo: nextUser,
        ExpiresInSec: data?.ExpiresInSec ? Number(data.ExpiresInSec) : prev?.ExpiresInSec,
      });
      return true;
    } catch {
      clearAuthSession();
      return false;
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function apiCall<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST';
    body?: unknown;
    auth?: boolean;
    signal?: AbortSignal;
  } = {},
  allowRetry = true
): Promise<T> {
  const { method = 'GET', body, auth = true, signal } = options;

  const doFetch = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-Id': createRequestId(),
    };
    if (auth && memorySession?.SessionKey) {
      headers.Authorization = `Bearer ${memorySession.SessionKey}`;
    }
    return fetch(`${API_BASE}${path}`, {
      method,
      headers,
      credentials: 'include',
      cache: 'no-store',
      signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  };

  let res = await doFetch();

  const isAuthEndpoint =
    path === '/api/Auth/Login' ||
    path === '/api/Auth/Verify2FA' ||
    path === '/api/Auth/RefreshToken';

  if (res.status === 401 && allowRetry && !isAuthEndpoint && auth) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      res = await doFetch();
    } else {
      throw new B2bApiError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401);
    }
  }

  const text = await res.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { Message: text };
    }
  }

  if (!res.ok) {
    const fallback =
      res.status === 401
        ? 'Tài khoản chưa đăng nhập hoặc phiên đã hết hạn.'
        : res.status === 403
          ? 'Tài khoản không có quyền truy cập chức năng này.'
          : `Không thể tải dữ liệu (HTTP ${res.status}).`;
    throw new B2bApiError(extractMessage(payload, fallback), res.status);
  }

  if (payload && typeof payload === 'object' && 'Id' in payload) {
    const env = payload as { Id?: unknown; Message?: unknown; Data?: unknown };
    if (typeof env.Id === 'number' && env.Id < 1) {
      throw new B2bApiError(
        typeof env.Message === 'string' && env.Message.trim()
          ? env.Message.trim()
          : 'Yêu cầu không thành công.',
        res.status
      );
    }
    if ('Data' in env) {
      return env.Data as T;
    }
  }

  return payload as T;
}

export async function loginAccount(account: string, password: string): Promise<AuthSession> {
  const raw = await apiCall<Record<string, unknown>>('/api/Auth/Login', {
    method: 'POST',
    auth: false,
    body: {
      Account: account.trim(),
      Password: password,
      RememberMe: true,
    },
  });

  const session: AuthSession = {
    SessionKey: String(raw?.SessionKey ?? ''),
    UserInfo: (raw?.UserInfo ?? { UserId: 0, UserCode: account.trim() }) as AuthUserInfo,
    Requires2FA: Boolean(raw?.Requires2FA),
    ChallengeId: raw?.ChallengeId ? String(raw.ChallengeId) : undefined,
    ExpiresInSec: raw?.ExpiresInSec ? Number(raw.ExpiresInSec) : undefined,
  };

  if (!session.SessionKey && !session.Requires2FA) {
    throw new B2bApiError(extractMessage(raw, 'Đăng nhập thất bại.'), 401);
  }

  if (session.SessionKey && !session.Requires2FA) {
    saveAuthSession(session);
  }

  return session;
}

export async function verifyTwoFaCode(challengeId: string, code: string): Promise<AuthSession> {
  const raw = await apiCall<Record<string, unknown>>('/api/Auth/Verify2FA', {
    method: 'POST',
    auth: false,
    body: {
      ChallengeId: challengeId,
      Code: code.trim(),
    },
  });

  const session: AuthSession = {
    SessionKey: String(raw?.SessionKey ?? ''),
    UserInfo: (raw?.UserInfo ?? { UserId: 0, UserCode: '' }) as AuthUserInfo,
    ExpiresInSec: raw?.ExpiresInSec ? Number(raw.ExpiresInSec) : undefined,
  };

  if (!session.SessionKey) {
    throw new B2bApiError(extractMessage(raw, 'Mã xác thực không chính xác.'), 401);
  }

  saveAuthSession(session);
  return session;
}

export async function logoutAccount(): Promise<void> {
  const userId = memorySession?.UserInfo?.UserId;
  try {
    await apiCall('/api/Auth/Logout', {
      method: 'POST',
      auth: false,
      body: userId ? { UserId: userId } : {},
    });
  } catch {
    // ignore logout transport error
  } finally {
    clearAuthSession();
  }
}
