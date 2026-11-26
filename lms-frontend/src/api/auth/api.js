import { ApiError, instance, toApiError } from "../client.js";

// POST /api/auth/login -> { status, message, data: { token, user } }
export async function login(credentials) {
  try {
    const response = await instance.post("/auth/login", credentials);
    const data = response?.data?.data;

    if (typeof data?.token !== "string" || !data.token) {
      throw new ApiError("La réponse de connexion est invalide.");
    }

    return { token: data.token, user: data.user ?? null };
  } catch (error) {
    throw toApiError(error, "La connexion a échoué.");
  }
}

// GET /api/auth/me -> { status, message, data: { id, name, email, role, status } }
// The token is passed explicitly so the certified profile never depends on a
// value left in the browser by a previous request.
export async function getCurrentUser(token, signal) {
  if (!token) {
    throw new ApiError("Session expirée. Reconnectez-vous.", 401);
  }

  try {
    const response = await instance.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    const user = response?.data?.data;

    if (!user || typeof user.id !== "string" || typeof user.role !== "string") {
      throw new ApiError("Le profil renvoyé par le serveur est invalide.");
    }

    return {
      id: user.id,
      name: user.name ?? null,
      email: user.email ?? null,
      role: user.role,
      status: user.status ?? null,
    };
  } catch (error) {
    throw toApiError(error, "Impossible de charger le profil.");
  }
}
