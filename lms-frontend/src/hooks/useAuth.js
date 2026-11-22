import { useState } from "react";
import { getCurrentUser, login as loginRequest } from "../api/auth";

export function useAuth() {
  const [session, setSession] = useState(null);
  async function login(credentials) {
    const token = await loginRequest(credentials);
    const user = await getCurrentUser(token);

    setSession({ token, user });
  }

  function logout() {
    setSession(null);
  }

  return {
    session,
    login,
    logout,
  };
}
