export class ApiError extends Error {
  constructor(message, status = 0, errors = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

const baseUrl = (import.meta.env?.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export async function request(path, { token, body, signal, method = 'GET' } = {}) {
  let response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method, signal,
      headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Connexion impossible. Vérifiez votre connexion et réessayez.')
  }
  if (response.status === 204) return null
  let payload
  try { payload = await response.json() } catch {
    throw new ApiError('Réponse du serveur illisible. Réessayez.', response.status)
  }
  if (!response.ok) throw new ApiError(payload.message || 'La requête a échoué.', response.status, payload.errors || [])
  return payload
}
