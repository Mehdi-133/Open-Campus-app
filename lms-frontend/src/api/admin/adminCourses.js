import axios from "axios";
import { instance } from "../client.js";

export async function getAdminCourses() {
  try {
    const response = await instance.get("/admin/courses");
    const courses = response?.data;
    return courses;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new Error(error.response.data.message);
    }
  }
}
