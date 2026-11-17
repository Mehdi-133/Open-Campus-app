import {
  ENROLLMENT_STATUS_LABELS,
  LEVEL_LABELS,
  labelFor,
  progressFor,
  usableEnrollments,
} from './courseLabels.js'
import { initialFor, labelFor as userLabelFor, STATUS_LABELS } from './userLabels.js'

const USER_STATUS_TONES = {
  active: 'active',
  suspended: 'suspended',
}

function averageProgress(enrollments) {
  if (enrollments.length === 0) {
    return 0
  }

  const total = enrollments.reduce((sum, enrollment) => sum + progressFor(enrollment), 0)

  return Math.round(total / enrollments.length)
}

function ProgressBar({ value }) {
  return (
    <div
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={value}
      className="progress-track"
      role="progressbar"
    >
      <span style={{ width: `${value}%` }} />
    </div>
  )
}

function DashboardPanel({ action, children, onAction, tone }) {
  return (
    <div className={`dashboard-state${tone ? ` dashboard-state--${tone}` : ''}`} role={tone === 'error' ? 'alert' : undefined}>
      <div>{children}</div>
      {action ? (
        <button className={tone === 'error' ? 'dashboard-state__retry' : 'dashboard-secondary'} onClick={onAction} type="button">
          {action}
        </button>
      ) : null}
    </div>
  )
}

function CourseHero({ enrollment, onNavigate }) {
  const progress = progressFor(enrollment)
  const course = enrollment.course
  const isDone = progress >= 100 || enrollment.status === 'completed'

  return (
    <article className="course-hero">
      <p className="course-hero__eyebrow">{isDone ? 'COURS TERMINÉ' : 'VOTRE COURS ACTUEL'}</p>
      <h3>{course.title}</h3>
      <p className="course-hero__meta">
        {course.category} · {labelFor(LEVEL_LABELS, course.level)} ·{' '}
        {labelFor(ENROLLMENT_STATUS_LABELS, enrollment.status)}
      </p>

      <div className="course-hero__progress">
        <div className="course-hero__progress-labels">
          <span>Progression</span>
          <strong>{progress} %</strong>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="course-hero__actions">
        <button className="dashboard-primary" onClick={() => onNavigate('courses')} type="button">
          Ouvrir mes cours
        </button>
        <button className="dashboard-ghost" onClick={() => onNavigate('courses')} type="button">
          Voir mon parcours
        </button>
      </div>
    </article>
  )
}

export function LearnerDashboard({ coursesError, coursesStatus, enrollments, onLoadCourses, onNavigate, user }) {
  const firstName = user.name?.trim().split(/\s+/)[0]
  const courseEnrollments = usableEnrollments(enrollments)
  const missingCourses = enrollments.length - courseEnrollments.length
  const average = averageProgress(courseEnrollments)
  const completedCount = courseEnrollments.filter(
    (enrollment) => progressFor(enrollment) >= 100 || enrollment.status === 'completed',
  ).length

  // The most advanced course still in progress is the most likely one to resume.
  // Completed courses are only used when nothing is left in progress.
  const activeEnrollments = courseEnrollments.filter(
    (enrollment) => enrollment.status !== 'completed' && progressFor(enrollment) < 100,
  )
  const candidates = activeEnrollments.length > 0 ? activeEnrollments : courseEnrollments
  const current = candidates.reduce((best, enrollment) => {
    if (!best) {
      return enrollment
    }

    return progressFor(enrollment) > progressFor(best) ? enrollment : best
  }, null)

  const userStatusLabel = userLabelFor(STATUS_LABELS, user.status)
  const userStatusTone = USER_STATUS_TONES[user.status] || 'neutral'

  return (
    <div className="learner-dashboard" aria-label="Espace apprenant">
      <div className="learner-dashboard__main">
        <header className="learner-greeting">
          <p className="eyebrow">VOTRE ESPACE APPRENANT</p>
          <h2>
            {firstName
              ? `Bonjour ${firstName}, prêt à poursuivre votre apprentissage ?`
              : 'Prêt à poursuivre votre apprentissage ?'}
          </h2>
          <p>Vos cours inscrits et votre progression apparaissent ici, uniquement après votre demande.</p>
        </header>

        {coursesStatus === 'idle' ? (
          <DashboardPanel action="Charger mes cours" onAction={onLoadCourses}>
            <h3>Vos cours ne sont pas encore chargés</h3>
            <p>La liste de vos inscriptions est demandée au serveur uniquement lorsque vous cliquez ci-dessous.</p>
          </DashboardPanel>
        ) : null}

        {coursesStatus === 'loading' ? (
          <div className="dashboard-state" role="status">
            <span className="dashboard-state__spinner" aria-hidden="true" />
            <div>
              <h3>Chargement de vos cours…</h3>
              <p>Vos inscriptions sont demandées au serveur.</p>
            </div>
          </div>
        ) : null}

        {coursesStatus === 'forbidden' ? (
          <DashboardPanel tone="error">
            <h3>Accès refusé</h3>
            <p>Le serveur a refusé cette demande. Votre session reste active.</p>
          </DashboardPanel>
        ) : null}

        {coursesStatus === 'error' ? (
          <DashboardPanel action="Réessayer" onAction={onLoadCourses} tone="error">
            <h3>Le chargement a échoué</h3>
            <p>{coursesError}</p>
          </DashboardPanel>
        ) : null}

        {coursesStatus === 'success' && courseEnrollments.length === 0 ? (
          <DashboardPanel action="Actualiser mes cours" onAction={onLoadCourses}>
            <h3>Aucun cours pour le moment</h3>
            <p>Le serveur n’a renvoyé aucune inscription pour votre compte.</p>
          </DashboardPanel>
        ) : null}

        {coursesStatus === 'success' && current ? <CourseHero enrollment={current} onNavigate={onNavigate} /> : null}

        {coursesStatus === 'success' && courseEnrollments.length > 0 ? (
          <>
            <div className="dashboard-stats">
              <article className="stat-card">
                <p className="stat-card__label">Cours inscrits</p>
                <strong>{courseEnrollments.length}</strong>
                <p>{completedCount === 1 ? '1 cours terminé' : `${completedCount} cours terminés`}</p>
              </article>
              <article className="stat-card">
                <p className="stat-card__label">Progression moyenne</p>
                <strong>{average} %</strong>
                <p>Sur l’ensemble de vos cours</p>
              </article>
              <article className="stat-card">
                <p className="stat-card__label">Cours à reprendre</p>
                <strong>{courseEnrollments.length - completedCount}</strong>
                <p>Progression inférieure à 100 %</p>
              </article>
            </div>

            <section className="dashboard-section">
              <div className="dashboard-section__heading">
                <div>
                  <p className="eyebrow">VOTRE APPRENTISSAGE</p>
                  <h3>Mes cours</h3>
                </div>
                <div className="dashboard-section__actions">
                  <span className="dashboard-pill">{courseEnrollments.length} cours</span>
                  <button className="section-link" onClick={onLoadCourses} type="button">
                    Actualiser
                  </button>
                  <button className="section-link" onClick={() => onNavigate('courses')} type="button">
                    Tout voir <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>

              <div className="course-grid">
                {courseEnrollments.map((enrollment) => {
                  const course = enrollment.course
                  const progress = progressFor(enrollment)

                  return (
                    <article className="course-tile" key={enrollment._id || enrollment.id}>
                      <div className="course-tile__top">
                        <span className="status-badge status-badge--neutral">
                          {labelFor(LEVEL_LABELS, course.level)}
                        </span>
                        <strong>{progress} %</strong>
                      </div>
                      <h4>{course.title}</h4>
                      <p className="course-tile__meta">
                        {course.category} · {labelFor(ENROLLMENT_STATUS_LABELS, enrollment.status)}
                      </p>
                      <ProgressBar value={progress} />
                      <button className="course-tile__link" onClick={() => onNavigate('courses')} type="button">
                        Continuer <span aria-hidden="true">→</span>
                      </button>
                    </article>
                  )
                })}
              </div>

              {missingCourses > 0 ? (
                <p className="dashboard-note">
                  {missingCourses === 1
                    ? '1 inscription référence un cours qui n’est plus disponible.'
                    : `${missingCourses} inscriptions référencent un cours qui n’est plus disponible.`}
                </p>
              ) : null}
            </section>
          </>
        ) : null}
      </div>

      <aside className="learner-dashboard__rail" aria-label="Votre compte">
        <section className="rail-card">
          <span className="rail-card__avatar" aria-hidden="true">{initialFor(user)}</span>
          <h3>{user.name?.trim() || user.email || 'Compte sans nom'}</h3>
          <p className="rail-card__email">{user.email || 'Adresse e-mail non renseignée'}</p>
          <span className={`status-badge status-badge--${userStatusTone}`}>
            <span className="status-badge__dot" aria-hidden="true" />
            {userStatusLabel}
          </span>
          <button className="section-link" onClick={() => onNavigate('profile')} type="button">
            Voir mon profil <span aria-hidden="true">→</span>
          </button>
        </section>

        <section className="rail-card">
          <p className="eyebrow">PROCHAINE ÉTAPE</p>
          {current ? (
            <>
              <h3>{current.course.title}</h3>
              <p>
                {progressFor(current) >= 100
                  ? 'Ce cours est terminé. Explorez vos autres inscriptions pour continuer.'
                  : `Il vous reste ${100 - progressFor(current)} % à parcourir sur ce cours.`}
              </p>
            </>
          ) : coursesStatus === 'success' ? (
            <>
              <h3>Aucun cours pour le moment</h3>
              <p>Les cours confirmés par le serveur apparaîtront ici dès votre première inscription.</p>
            </>
          ) : (
            <>
              <h3>Charger vos cours</h3>
              <p>Votre progression apparaîtra ici dès que le serveur aura renvoyé vos inscriptions.</p>
            </>
          )}
          {coursesStatus === 'idle' ? (
            <button className="section-link" onClick={onLoadCourses} type="button">
              Charger mes cours <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button className="section-link" onClick={() => onNavigate('courses')} type="button">
              Ouvrir mes cours <span aria-hidden="true">→</span>
            </button>
          )}
        </section>
      </aside>
    </div>
  )
}
