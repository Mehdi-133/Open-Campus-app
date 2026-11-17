import { COURSE_STATUS_LABELS, labelFor } from './courseLabels.js'

export const ALL_FILTER = 'all'
export const COURSE_STATUS_FILTERS = ['draft', 'published', 'archived']

const CATEGORY_PREFIX = 'category:'

export function categoryFilterValue(category) {
  return `${CATEGORY_PREFIX}${category}`
}

function categoryFromFilterValue(value) {
  return typeof value === 'string' && value.startsWith(CATEGORY_PREFIX)
    ? value.slice(CATEGORY_PREFIX.length)
    : null
}

export function courseCategoryOptions(courses) {
  const counts = courses.reduce((totals, course) => {
    const category = course.category || ''
    totals[category] = (totals[category] || 0) + 1
    return totals
  }, Object.create(null))

  return Object.keys(counts)
    .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))
    .map((category) => ({
      count: counts[category],
      label: category || 'Non renseignée',
      value: categoryFilterValue(category),
    }))
}

export function courseStatusOptions(courses) {
  const counts = courses.reduce((totals, course) => {
    totals[course.status] = (totals[course.status] || 0) + 1
    return totals
  }, Object.create(null))

  return COURSE_STATUS_FILTERS
    .filter((status) => counts[status] > 0)
    .map((status) => ({
      count: counts[status],
      label: labelFor(COURSE_STATUS_LABELS, status),
      value: status,
    }))
}

export function matchesCourseFilters(course, category, status) {
  const selectedCategory = categoryFromFilterValue(category)
  const categoryMatches = category === ALL_FILTER
    || (selectedCategory !== null && course.category === selectedCategory)
  const statusMatches = status === ALL_FILTER || course.status === status

  return categoryMatches && statusMatches
}

export function hasActiveCourseFilters(category, status) {
  return category !== ALL_FILTER || status !== ALL_FILTER
}

export function courseFilterCountLabel(visibleCount, totalCount) {
  const base = visibleCount === 1 ? '1 cours' : `${visibleCount} cours`

  return visibleCount === totalCount ? base : `${base} sur ${totalCount}`
}
