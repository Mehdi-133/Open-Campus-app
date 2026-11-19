// Shared French labels for user roles and statuses.
// Kept in one place so the list and the detail panel stay consistent.
export const ROLE_LABELS = {
  admin: 'Administrateur',
  trainer: 'Formateur',
  learner: 'Apprenant',
}

export const STATUS_LABELS = {
  active: 'Actif',
  suspended: 'Suspendu',
}

// Fallback to the raw value so an unknown role/status is still visible.
export function labelFor(labels, value) {
  return labels[value] || value || 'Non renseigné'
}

// First letter used inside the avatar circle.
export function initialFor(user) {
  const source = user.name?.trim() || user.email?.trim() || '?'

  return source.slice(0, 1).toUpperCase()
}
