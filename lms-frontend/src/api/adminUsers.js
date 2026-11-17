import { ApiError, request } from './client.js'

// GET /api/admin/users returns { count, data } with account summaries.
// The server enforces the admin role; this adapter only validates the envelope.
export async function getAdminUsers(token) {
  if (!token) {
    throw new ApiError('Vous devez être connecté pour charger les utilisateurs.', 401)
  }

  const response = await request('/admin/users', { token })
  const users = response?.data

  if (!Array.isArray(users) || !Number.isInteger(response?.count) || response.count !== users.length) {
    throw new ApiError('La liste des utilisateurs renvoyée par le serveur est invalide.')
  }

  if (users.some((user) => typeof user?.id !== 'string')) {
    throw new ApiError('La liste des utilisateurs contient une entrée sans identifiant.')
  }

  return users
}
