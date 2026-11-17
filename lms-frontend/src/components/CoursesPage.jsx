import { useState } from 'react'
import { ALL_FILTER, matchesCourseFilters } from './courseFilters.js'
import { CourseFilters } from './CourseFilters.jsx'
import { CourseList } from './CourseList.jsx'

const IDLE = 'idle'
const LOADING = 'loading'
const SUCCESS = 'success'
const ERROR = 'error'
const FORBIDDEN = 'forbidden'

export function CoursesLoading() {
  return (
    <div className="users-page__state" role="status">
      <span className="users-page__spinner" aria-hidden="true" />
      <div>
        <h3>Chargement du catalogue...</h3>
        <p>La liste complète des cours est demandée au serveur.</p>
      </div>
    </div>
  )
}

export function CoursesEmpty() {
  return (
    <div className="users-page__state">
      <div>
        <h3>Aucun cours à afficher</h3>
        <p>Le serveur n’a renvoyé aucun cours, quel que soit son statut.</p>
      </div>
    </div>
  )
}

export function CoursesError({ message, onRetry }) {
  return (
    <div className="users-page__state users-page__state--error" role="alert">
      <div>
        <h3>Le chargement a échoué</h3>
        <p>{message}</p>
      </div>
      <button className="users-page__retry" onClick={onRetry} type="button">Réessayer</button>
    </div>
  )
}

export function CoursesForbidden() {
  return (
    <div className="users-page__state users-page__state--error" role="alert">
      <div>
        <h3>Accès refusé</h3>
        <p>Le serveur a refusé cette demande. Votre session reste active.</p>
      </div>
    </div>
  )
}

export function CoursesPage({ onLoadCourses }) {
  const [status, setStatus] = useState(IDLE)
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(ALL_FILTER)
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER)

  async function loadCourses() {
    if (status === LOADING) {
      return
    }

    setStatus(LOADING)
    setError('')
    setCategoryFilter(ALL_FILTER)
    setStatusFilter(ALL_FILTER)

    try {
      const nextCourses = await onLoadCourses()
      setCourses(Array.isArray(nextCourses) ? nextCourses : [])
      setStatus(SUCCESS)
    } catch (requestError) {
      setCourses([])
      setError(requestError?.message || 'La demande a échoué. Réessayez.')
      setStatus(requestError?.status === 403 ? FORBIDDEN : ERROR)
    }
  }

  // The visible list is derived during render from the server data and both
  // local filters. No second list is stored in state and no request is made.
  const filteredCourses = courses.filter((course) => (
    matchesCourseFilters(course, categoryFilter, statusFilter)
  ))
  const hasCourses = status === SUCCESS && courses.length > 0

  return (
    <section className="courses-page" aria-label="Catalogue administrateur des cours">
      <div className="courses-page__toolbar">
        <div className="courses-page__intro">
          <p className="eyebrow">CATALOGUE COMPLET</p>
          <p className="courses-page__description">
            Consultez le titre, la catégorie, le niveau et le statut de tous les cours,
            qu’ils soient en brouillon, publiés ou archivés. La liste n’est demandée
            au serveur qu’à partir du bouton ci-dessous ; les filtres restent locaux.
          </p>
        </div>
        <div className="courses-page__actions">
          <button
            className="courses-page__load"
            disabled={status === LOADING}
            onClick={loadCourses}
            type="button"
          >
            {status === LOADING ? 'Chargement...' : hasCourses ? 'Recharger le catalogue' : 'Charger les cours'}
          </button>
        </div>
      </div>

      <div aria-busy={status === LOADING} aria-live="polite" className="courses-page__result">
        {status === IDLE ? (
          <p className="courses-page__hint">
            Aucun chargement n’a encore été demandé. Utilisez « Charger les cours » pour afficher le catalogue.
          </p>
        ) : null}

        {status === LOADING ? <CoursesLoading /> : null}

        {status === ERROR ? <CoursesError message={error} onRetry={loadCourses} /> : null}

        {status === FORBIDDEN ? <CoursesForbidden /> : null}

        {status === SUCCESS && courses.length === 0 ? <CoursesEmpty /> : null}

        {hasCourses ? (
          <>
            <CourseFilters
              category={categoryFilter}
              courses={courses}
              onCategoryChange={setCategoryFilter}
              onReset={() => {
                setCategoryFilter(ALL_FILTER)
                setStatusFilter(ALL_FILTER)
              }}
              onStatusChange={setStatusFilter}
              resultCount={filteredCourses.length}
              status={statusFilter}
              totalCount={courses.length}
            />

            {filteredCourses.length > 0 ? (
              <CourseList courses={filteredCourses} />
            ) : (
              <div className="users-page__state">
                <div>
                  <h3>Aucun cours pour cette combinaison</h3>
                  <p>Aucun cours ne correspond à la catégorie et au statut sélectionnés.</p>
                </div>
                <button
                  className="users-page__retry"
                  onClick={() => {
                    setCategoryFilter(ALL_FILTER)
                    setStatusFilter(ALL_FILTER)
                  }}
                  type="button"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  )
}
