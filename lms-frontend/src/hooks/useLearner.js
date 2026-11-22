import { ApiError } from "../api/client.js";
import { getMyEnrollments } from "../api/enrollments.js";

export function useLearner(session, onUnauthorized) {
  async function loadEnrollments() {
    if (!session?.token) {
      throw new ApiError("Session expirée. Reconnectez-vous.", 401);
    }

    try {
      return await getMyEnrollments(session.token);
    } catch (error) {
      if (error?.status === 401) {
        onUnauthorized();
      }
      throw error;
    }
  }

  return { loadEnrollments };
}
