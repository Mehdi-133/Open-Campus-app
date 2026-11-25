import axios from "axios";
import { ApiError, instance } from "../client.js";

function readAccountSummary(user, invalidMessage) {
  if (
    !user ||
    typeof user.id !== "string" ||
    typeof user.name !== "string" ||
    typeof user.email !== "string" ||
    !["learner", "trainer", "admin"].includes(user.role) ||
    !["active", "suspended"].includes(user.status)
  ) {
    throw new ApiError(invalidMessage);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export async function getAdminUsers() {
  try {
    const response = await instance.get("/admin/users");
    const users = response?.data;

    return users;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new Error(error.response.data.message);
    }
  }
}

export async function createAdminUser(values) {
  try {
    const response = await instance.post("/admin/users", values);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new Error(error.response.data.message);
    }
  }
}

export async function updateAdminUser(values, id) {
  try {
    const response = await instance.patch("/admin/users/" + id, values);
    return readAccountSummary(
      response?.data,
      "Le compte modifié renvoyé par le serveur est invalide.",
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new Error(error.response.data.message);
    }
  }
}
