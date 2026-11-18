import {
  ALL_FILTER,
  courseCategoryOptions,
  courseFilterCountLabel,
  courseLevelOptions,
  courseStatusOptions,
  hasActiveCourseFilters,
} from './courseFilters.js'

// Controlled filters: the page owns the four filter values; this component only
// derives its options from the loaded catalogue and reports changes.
export function CourseFilters({
  category,
  courses,
  keyword,
  level,
  onCategoryChange,
  onKeywordChange,
  onLevelChange,
  onReset,
  onStatusChange,
  resultCount,
  status,
  totalCount,
}) {
  const categoryOptions = courseCategoryOptions(courses)
  const statusOptions = courseStatusOptions(courses)
  const levelOptions = courseLevelOptions(courses)
  const activeFilters = { category, keyword, level, status }

  return (
    <section aria-label="Filtrer le catalogue" className="course-filters">
      <div className="course-filters__fields">
        <div className="course-filters__field">
          <label htmlFor="course-search-filter">Rechercher</label>
          <input
            aria-controls="course-inventory"
            id="course-search-filter"
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Titre du cours"
            type="search"
            value={keyword}
          />
        </div>

        <div className="course-filters__field">
          <label htmlFor="course-level-filter">Niveau</label>
          <select
            aria-controls="course-inventory"
            id="course-level-filter"
            onChange={(event) => onLevelChange(event.target.value)}
            value={level}
          >
            <option value={ALL_FILTER}>Tous les niveaux</option>
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>

        <div className="course-filters__field">
          <label htmlFor="course-category-filter">Catégorie</label>
          <select
            aria-controls="course-inventory"
            id="course-category-filter"
            onChange={(event) => onCategoryChange(event.target.value)}
            value={category}
          >
            <option value={ALL_FILTER}>Toutes les catégories</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>

        <div className="course-filters__field">
          <label htmlFor="course-status-filter">Statut</label>
          <select
            aria-controls="course-inventory"
            id="course-status-filter"
            onChange={(event) => onStatusChange(event.target.value)}
            value={status}
          >
            <option value={ALL_FILTER}>Tous les statuts</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="course-filters__summary">
        <p aria-live="polite" className="course-filters__count">
          {courseFilterCountLabel(resultCount, totalCount)}
        </p>
        {hasActiveCourseFilters(activeFilters) ? (
          <button className="course-filters__reset" onClick={onReset} type="button">
            Réinitialiser les filtres
          </button>
        ) : null}
      </div>
    </section>
  )
}
