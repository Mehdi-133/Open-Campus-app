import axios from "axios";
import { instance } from "./client.js";

export async function login(credentials) {
  try {
    const response = await instance.post("/auth/login", credentials);

    const token = response?.data?.token;

    return token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new Error(error?.response?.data?.message);
    }
  }
}

export async function getCurrentUser() {
  try {
    const response = await instance.get("/auth/me");
    const user = response?.data;
    return user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new Error(error.response.data.message);
    }
  }
}
