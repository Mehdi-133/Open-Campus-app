import { COURSE_STATUS_LABELS, LEVEL_LABELS, labelFor } from './courseLabels.js'

export const ALL_FILTER = 'all'
export const COURSE_STATUS_FILTERS = ['draft', 'published', 'archived']
const COURSE_LEVEL_FILTERS = ['beginner', 'intermediate', 'advanced']

const CATEGORY_PREFIX = 'category:'

export function categoryFilterValue(category) {
  return `${CATEGORY_PREFIX}${category}`
}

function categoryFromFilterValue(value) {
  return typeof value === 'string' && value.startsWith(CATEGORY_PREFIX)
    ? value.slice(CATEGORY_PREFIX.length)
    : null
}

function normalizeText(value) {
  return String(value || '')
    .toLocaleLowerCase('fr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function optionsFromCounts(counts, labels, order) {
  return order
    .filter((value) => counts[value] > 0)
    .map((value) => ({
      count: counts[value],
      label: labelFor(labels, value),
      value,
    }))
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

  return optionsFromCounts(counts, COURSE_STATUS_LABELS, COURSE_STATUS_FILTERS)
}

export function courseLevelOptions(courses) {
  const counts = courses.reduce((totals, course) => {
    totals[course.level] = (totals[course.level] || 0) + 1
    return totals
  }, Object.create(null))

  return optionsFromCounts(counts, LEVEL_LABELS, COURSE_LEVEL_FILTERS)
}

// Every predicate is local and pure: filtering never calls the API.
export function matchesCourseFilters(course, filters = {}) {
  const category = filters.category ?? ALL_FILTER
  const status = filters.status ?? ALL_FILTER
  const level = filters.level ?? ALL_FILTER
  const keyword = normalizeText(filters.keyword)

  const selectedCategory = categoryFromFilterValue(category)
  const categoryMatches = category === ALL_FILTER
    || (selectedCategory !== null && course.category === selectedCategory)
  const statusMatches = status === ALL_FILTER || course.status === status
  const levelMatches = level === ALL_FILTER || course.level === level
  const keywordMatches = !keyword || normalizeText(course.title).includes(keyword)

  return categoryMatches && statusMatches && levelMatches && keywordMatches
}

export function hasActiveCourseFilters(filters = {}) {
  return (filters.category ?? ALL_FILTER) !== ALL_FILTER
    || (filters.status ?? ALL_FILTER) !== ALL_FILTER
    || (filters.level ?? ALL_FILTER) !== ALL_FILTER
    || Boolean(normalizeText(filters.keyword))
}

export function courseFilterCountLabel(visibleCount, totalCount) {
  const base = visibleCount === 1 ? '1 cours' : `${visibleCount} cours`

  return visibleCount === totalCount ? base : `${base} sur ${totalCount}`
}
