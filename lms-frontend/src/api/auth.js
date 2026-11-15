import { ApiError, request } from './client.js'

export async function login(credentials) {
  const response = await request('/auth/login', {
    body: credentials,
    method: 'POST',
  })

  const token = response?.data?.token

  if (!token) {
    throw new ApiError('Le serveur n’a pas renvoyé de jeton de connexion.')
  }

  return token
}

export async function getCurrentUser(token) {
  const response = await request('/auth/me', { token })
  const user = response?.data

  if (!user?.id || !user?.role) {
    throw new ApiError('Le profil renvoyé par le serveur est incomplet.')
  }

  return user
}
