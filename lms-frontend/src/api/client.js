import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/$/,
  "",
);

// Only the session token is persisted. The certified user profile always comes
// from GET /auth/me and is never written to browser storage.
export const TOKEN_STORAGE_KEY = "lms.auth.token";

export class ApiError extends Error {
  constructor(message, status = 0, errors = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeToken(token) {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Storage can be blocked (private mode, quota); the in-memory session still works.
  }
}

export function clearStoredToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}

export const instance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    // An explicit token (e.g. the one just returned by login) wins over a
    // possibly stale token left in storage.
    if (!config.headers.Authorization && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export function toApiError(error, fallbackMessage) {
  if (error instanceof ApiError || error?.name === "CanceledError") {
    return error;
  }

  if (error?.response) {
    const { data, status } = error.response;
    return new ApiError(
      data?.message || fallbackMessage,
      status,
      Array.isArray(data?.errors) ? data.errors : [],
    );
  }

  return new ApiError(
    "Connexion impossible. Vérifiez votre connexion et réessayez.",
  );
}
