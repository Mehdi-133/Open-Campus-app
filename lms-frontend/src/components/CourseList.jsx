import { COURSE_STATUS_LABELS, LEVEL_LABELS, labelFor } from './courseLabels.js'

export function CourseList({ courses }) {
  return (
    <ul className="course-inventory">
      {courses.map((course) => (
        <li className="course-inventory__card" key={course.id}>
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
            <div>
              <dt>Statut</dt>
              <dd>{labelFor(COURSE_STATUS_LABELS, course.status)}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  )
}
