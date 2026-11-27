import { ApiError, instance, toApiError } from "../client.js";

function readCourseSummary(course) {
  if (
    !course ||
    typeof course.id !== "string" ||
    typeof course.title !== "string" ||
    typeof course.category !== "string" ||
    typeof course.level !== "string" ||
    typeof course.status !== "string"
  ) {
    throw new ApiError("Un cours du catalogue renvoyé par le serveur est invalide.");
  }

  return {
    id: course.id,
    title: course.title,
    category: course.category,
    level: course.level,
    status: course.status,
  };
}

// GET /api/admin/courses -> { count, data } with public summaries only.
export async function getAdminCourses(token, signal) {
  if (!token) {
    throw new ApiError("Session expirée. Reconnectez-vous.", 401);
  }

  try {
    const response = await instance.get("/admin/courses", {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    const payload = response?.data;

    if (!payload || !Array.isArray(payload.data)) {
      throw new ApiError("Le catalogue renvoyé par le serveur est invalide.");
    }

    return payload.data.map(readCourseSummary);
  } catch (error) {
    throw toApiError(error, "Impossible de charger le catalogue.");
  }
}
