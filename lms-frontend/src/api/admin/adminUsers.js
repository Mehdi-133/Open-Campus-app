import { ApiError, instance, toApiError } from "../client.js";

const ROLES = ["learner", "trainer", "admin"];
const STATUSES = ["active", "suspended"];

function readAccountSummary(user) {
  if (
    !user ||
    typeof user.id !== "string" ||
    typeof user.name !== "string" ||
    typeof user.email !== "string" ||
    !ROLES.includes(user.role) ||
    !STATUSES.includes(user.status)
  ) {
    throw new ApiError("Le compte renvoyé par le serveur est invalide.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

function requireToken(token) {
  if (!token) {
    throw new ApiError("Session expirée. Reconnectez-vous.", 401);
  }
}

// GET /api/admin/users -> { count, data } of public account summaries.
export async function getAdminUsers(token, signal) {
  requireToken(token);

  try {
    const response = await instance.get("/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    const payload = response?.data;

    if (!payload || !Array.isArray(payload.data)) {
      throw new ApiError("La liste des utilisateurs renvoyée par le serveur est invalide.");
    }

    return payload.data.map(readAccountSummary);
  } catch (error) {
    throw toApiError(error, "Impossible de charger les utilisateurs.");
  }
}

// POST /api/admin/users -> { status, message, data }.
export async function createAdminUser(token, values, signal) {
  requireToken(token);

  try {
    const response = await instance.post("/admin/users", values, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });

    return readAccountSummary(response?.data?.data);
  } catch (error) {
    throw toApiError(error, "Impossible de créer le compte.");
  }
}

// PATCH /api/admin/users/:id -> { status, message, data }.
export async function updateAdminUser(token, id, values, signal) {
  requireToken(token);

  try {
    const response = await instance.patch(`/admin/users/${id}`, values, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });

    return readAccountSummary(response?.data?.data);
  } catch (error) {
    throw toApiError(error, "Impossible de modifier le compte.");
  }
}
