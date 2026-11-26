import { ApiError, request } from './client.js'

// GET /api/enrollments/me returns a bare array of enrollments whose course is populated.
// The contract is documented in fondations_API_LMS/docs/react-api-contract.md.
export async function getMyEnrollments(token) {
  if (!token) {
    throw new ApiError('Vous devez être connecté pour charger vos cours.', 401)
  }

  const data = await request('/enrollments/me', { token })

  if (!Array.isArray(data)) {
    throw new ApiError('La liste des inscriptions renvoyée par le serveur est invalide.')
  }

  return data
}
