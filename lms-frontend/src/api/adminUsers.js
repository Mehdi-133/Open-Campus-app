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

// POST /api/admin/users creates an account from the controlled form values and
// returns { status, message, data } with a public account summary. The server
// enforces the admin role; this adapter only validates the success envelope.
export async function createAdminUser(token, values) {
  if (!token) {
    throw new ApiError('Vous devez être connecté pour créer un compte.', 401)
  }

  const response = await request('/admin/users', {
    method: 'POST',
    token,
    body: values,
  })
  const user = response?.data

  if (
    !user ||
    typeof user.id !== 'string' ||
    typeof user.name !== 'string' ||
    typeof user.email !== 'string' ||
    !['learner', 'trainer', 'admin'].includes(user.role) ||
    !['active', 'suspended'].includes(user.status)
  ) {
    throw new ApiError('Le compte créé renvoyé par le serveur est invalide.')
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  }
}
