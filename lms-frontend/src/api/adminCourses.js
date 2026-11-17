import { ApiError, request } from './client.js'

const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced']
const COURSE_STATUSES = ['draft', 'published', 'archived']

// GET /api/admin/courses returns { count, data } with a summary of every course
// in MongoDB across all publication states. The server enforces the admin role;
// this adapter only checks the envelope before exposing the plain array.
export async function getAdminCourses(token) {
  if (!token) {
    throw new ApiError('Vous devez être connecté pour charger les cours.', 401)
  }

  const response = await request('/admin/courses', { token })
  const courses = response?.data

  if (!Array.isArray(courses) || !Number.isInteger(response?.count) || response.count !== courses.length) {
    throw new ApiError('La liste des cours renvoyée par le serveur est invalide.')
  }

  const hasInvalidEntry = courses.some((course) => (
    typeof course?.id !== 'string' ||
    typeof course.title !== 'string' ||
    typeof course.category !== 'string' ||
    !COURSE_LEVELS.includes(course.level) ||
    !COURSE_STATUSES.includes(course.status)
  ))

  if (hasInvalidEntry) {
    throw new ApiError('La liste des cours contient une entrée invalide.')
  }

  return courses
}
