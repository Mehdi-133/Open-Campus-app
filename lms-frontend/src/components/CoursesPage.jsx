import { useState } from 'react'
import { CourseList } from './CourseList.jsx'
import { COURSE_STATUS_LABELS, labelFor } from './courseLabels.js'

const IDLE = 'idle'
const LOADING = 'loading'
const SUCCESS = 'success'
const ERROR = 'error'
const FORBIDDEN = 'forbidden'

const STATUS_FILTERS = ['all', 'draft', 'published', 'archived']

function filterLabel(id) {
  return id === 'all' ? 'Tous les statuts' : labelFor(COURSE_STATUS_LABELS, id)
}

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
  const [statusFilter, setStatusFilter] = useState('all')

  async function loadCourses() {
    if (status === LOADING) {
      return
    }

    setStatus(LOADING)
    setError('')
    setStatusFilter('all')

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

  // Counts and the visible list are derived during render from the server data
  // and one local filter. No second list is stored in state.
  const counts = courses.reduce(
    (totals, course) => ({ ...totals, [course.status]: (totals[course.status] || 0) + 1 }),
    { draft: 0, published: 0, archived: 0 },
  )
  const filteredCourses = statusFilter === 'all'
    ? courses
    : courses.filter((course) => course.status === statusFilter)
  const hasCourses = status === SUCCESS && courses.length > 0

  return (
    <section className="courses-page" aria-label="Catalogue administrateur des cours">
      <div className="courses-page__toolbar">
        <div className="courses-page__intro">
          <p className="eyebrow">CATALOGUE COMPLET</p>
          <p className="courses-page__description">
            Consultez le titre, la catégorie, le niveau et le statut de tous les cours,
            qu’ils soient en brouillon, publiés ou archivés. La liste n’est demandée
            au serveur qu’à partir du bouton ci-dessous.
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
            <div className="courses-page__filters" role="group" aria-label="Filtrer par statut">
              <div className="courses-page__filter-list">
                {STATUS_FILTERS.map((id) => (
                  <button
                    aria-pressed={statusFilter === id}
                    className="courses-page__filter"
                    key={id}
                    onClick={() => setStatusFilter(id)}
                    type="button"
                  >
                    {filterLabel(id)}{id === 'all' ? '' : ` (${counts[id]})`}
                  </button>
                ))}
              </div>
              <p className="courses-page__count">
                {filteredCourses.length} cours affiche(s) sur {courses.length}
              </p>
            </div>

            {filteredCourses.length > 0 ? (
              <CourseList courses={filteredCourses} />
            ) : (
              <div className="users-page__state">
                <div>
                  <h3>Aucun cours pour ce statut</h3>
                  <p>Choisissez un autre statut ou affichez le catalogue complet.</p>
                </div>
                <button className="users-page__retry" onClick={() => setStatusFilter('all')} type="button">
                  Afficher tous les statuts
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  )
}
