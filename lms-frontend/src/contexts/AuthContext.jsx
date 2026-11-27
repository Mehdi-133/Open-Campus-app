import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  clearStoredToken,
  getStoredToken,
  instance,
  storeToken,
} from "../api/client.js";
import { getCurrentUser, login as loginRequest } from "../api/auth";
import { SessionLoading } from "../components/common/SessionLoading.jsx";
import { AuthContext } from "./authContext.js";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearStoredToken();
    setSession(null);
  }, []);

  // Restore the session on mount: the stored token is only a key, so the user
  // is always re-certified by /auth/me before any protected UI is rendered.
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function restoreSession() {
      const token = getStoredToken();

      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser(token, controller.signal);
        if (active) setSession({ token, user });
      } catch (error) {
        if (active && error?.name !== "CanceledError") clearStoredToken();
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  // Any 401 on a protected request ends the session. A failed login (401 on
  // /auth/login) is a form error and must not purge an unrelated session.
  useEffect(() => {
    const interceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error?.response?.status === 401 &&
          !error.config?.url?.includes("/auth/login")
        ) {
          clearStoredToken();
          setSession(null);
          navigate("/login", { replace: true, state: null });
        }
        return Promise.reject(error);
      },
    );

    return () => instance.interceptors.response.eject(interceptor);
  }, [navigate]);

  const login = useCallback(async (credentials) => {
    const { token } = await loginRequest(credentials);
    const user = await getCurrentUser(token);

    storeToken(token);
    setSession({ token, user });
    return { token, user };
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token && session?.user),
      loading,
      login,
      logout,
    }),
    [session, loading, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <SessionLoading /> : children}
    </AuthContext.Provider>
  );
}
