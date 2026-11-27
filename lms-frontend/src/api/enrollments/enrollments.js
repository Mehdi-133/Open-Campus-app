import { ApiError, instance, toApiError } from "../client.js";

// GET /api/enrollments/me returns a bare array whose course field is populated.
export async function getMyEnrollments(token, signal) {
  if (!token) {
    throw new ApiError("Vous devez être connecté pour charger vos cours.", 401);
  }

  try {
    const response = await instance.get("/enrollments/me", {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    const enrollments = response?.data;

    if (!Array.isArray(enrollments)) {
      throw new ApiError("La liste des inscriptions renvoyée par le serveur est invalide.");
    }

    return enrollments;
  } catch (error) {
    throw toApiError(error, "Impossible de charger vos cours.");
  }
}
