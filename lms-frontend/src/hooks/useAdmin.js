import { ApiError } from "../api/client.js";

import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
} from "../api/admin/adminUsers.js";

import { getAdminCourses } from "../api/admin/adminCourses.js";

export function useAdmin(session, onUnauthorized) {
  function checkAdminAccess() {
    if (!session?.token || session?.user?.role !== "admin") {
      throw new ApiError("Accès refusé.", 403);
    }
  }

  async function handleRequest(request) {
    try {
      return await request();
    } catch (error) {
      if (error?.status === 401) {
        onUnauthorized();
      }

      throw error;
    }
  }

  async function loadUsers() {
    checkAdminAccess();

    return handleRequest(() => getAdminUsers(session.token));
  }

  async function loadCourses() {
    checkAdminAccess();

    return handleRequest(() => getAdminCourses(session.token));
  }

  async function createUser(values) {
    checkAdminAccess();

    return handleRequest(() => createAdminUser(session.token, values));
  }

  async function updateUser(id, values) {
    checkAdminAccess();

    return handleRequest(() => updateAdminUser(session.token, id, values));
  }

  return {
    loadUsers,
    loadCourses,
    createUser,
    updateUser,
  };
}
