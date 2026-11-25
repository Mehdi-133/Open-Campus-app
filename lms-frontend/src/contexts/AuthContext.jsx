import { createContext, useContext, useMemo, useState } from "react";
import { login as loginRequest } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  async function login(credentials) {
    const nextSession = await loginRequest(credentials);
    setSession(nextSession);
    return nextSession;
  }

  function logout() {
    setSession(null);
  }

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token && session?.user),
      loading,
      login,
      logout,
      setSession,
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
