// Shared French labels for course levels and enrollment statuses.
export const COURSE_STATUS_LABELS = {
  draft: 'Brouillon',
  published: 'Publié',
  archived: 'Archivé',
}

export const LEVEL_LABELS = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
}

export const ENROLLMENT_STATUS_LABELS = {
  active: 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé',
}

export const ENROLLMENT_STATUS_TONES = {
  active: 'active',
  completed: 'neutral',
  cancelled: 'suspended',
}

export function labelFor(labels, value) {
  return labels[value] || value || 'Non renseigné'
}

// Enrollment progress is a 0-100 number; anything else is treated as 0.
export function progressFor(enrollment) {
  const value = Number(enrollment?.progress)

  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(100, Math.max(0, Math.round(value)))
}

// A deleted course leaves a null population: the enrollment still exists but has no course.
export function usableEnrollments(enrollments) {
  return enrollments.filter((enrollment) => enrollment?.course)
}
