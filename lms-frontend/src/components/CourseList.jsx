import { COURSE_STATUS_LABELS, LEVEL_LABELS, labelFor } from './courseLabels.js'

const ART_TONES = ['mint', 'blue', 'pink', 'yellow']

function artToneFor(course) {
  const seed = `${course.category || ''}${course.title || ''}`
  let total = 0

  for (let index = 0; index < seed.length; index += 1) {
    total += seed.charCodeAt(index)
  }

  return ART_TONES[total % ART_TONES.length]
}

export function CourseList({ courses }) {
  return (
    <ul className="course-inventory" id="course-inventory">
      {courses.map((course) => (
        <li className="course-inventory__card" key={course.id}>
          <div className={`course-inventory__art course-inventory__art--${artToneFor(course)}`} aria-hidden="true">
            <svg viewBox="0 0 48 48" focusable="false">
              <path d="M6 17 24 8l18 9-18 9-18-9Z" />
              <path d="M14 22v9c6 4 14 4 20 0v-9" />
              <path d="M42 17v10" />
            </svg>
          </div>
          <div className="course-inventory__body">
            <div className="course-inventory__heading">
              <h4>{course.title || 'Cours sans titre'}</h4>
              <span className={`status-badge status-badge--${course.status}`}>
                <span className="status-badge__dot" aria-hidden="true" />
                {labelFor(COURSE_STATUS_LABELS, course.status)}
              </span>
            </div>
            <dl className="course-inventory__meta">
              <div>
                <dt>Catégorie</dt>
                <dd>{course.category || 'Non renseignée'}</dd>
              </div>
              <div>
                <dt>Niveau</dt>
                <dd>{labelFor(LEVEL_LABELS, course.level)}</dd>
              </div>
            </dl>
          </div>
        </li>
      ))}
    </ul>
  )
}
