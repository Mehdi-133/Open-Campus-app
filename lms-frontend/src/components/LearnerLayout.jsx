import { useState } from 'react'
import { AppShell } from './AppShell.jsx'
import { LearnerDashboard } from './LearnerDashboard.jsx'
import { LearnerProfilePage } from './LearnerProfilePage.jsx'
import { LEARNER_NAVIGATION } from './navigation.js'

function InformationPanel({ title, description }) {
  return (
    <section className="information-panel" aria-live="polite">
      <span className="information-panel__icon" aria-hidden="true">i</span>
      <div><h3>{title}</h3><p>{description}</p></div>
    </section>
  )
}

export function LearnerLayout({ activeView, onLoadEnrollments, onLogout, onNavigate, user }) {
  // Enrollment request state lives here: the dashboard and the future "Mes cours"
  // view both read the same list, so the closest common parent owns it.
  const [coursesStatus, setCoursesStatus] = useState('idle')
  const [enrollments, setEnrollments] = useState([])
  const [coursesError, setCoursesError] = useState('')

  const pageTitle = LEARNER_NAVIGATION.find((item) => item.id === activeView)?.label

  async function loadCourses() {
    if (coursesStatus === 'loading') {
      return
    }

    setCoursesStatus('loading')
    setCoursesError('')

    try {
      const nextEnrollments = await onLoadEnrollments()
      setEnrollments(Array.isArray(nextEnrollments) ? nextEnrollments : [])
      setCoursesStatus('success')
    } catch (requestError) {
      setEnrollments([])
      setCoursesError(requestError?.message || 'La demande a échoué. Réessayez.')
      setCoursesStatus(requestError?.status === 403 ? 'forbidden' : 'error')
    }
  }

  return (
    <AppShell
      activeView={activeView}
      navigation={LEARNER_NAVIGATION}
      onLogout={onLogout}
      onNavigate={onNavigate}
      roleLabel="Apprenant"
      user={user}
    >
      {activeView === 'overview' ? (
        <LearnerDashboard
          coursesError={coursesError}
          coursesStatus={coursesStatus}
          enrollments={enrollments}
          onLoadCourses={loadCourses}
          onNavigate={onNavigate}
          user={user}
        />
      ) : activeView === 'profile' ? (
        <LearnerProfilePage user={user} />
      ) : (
        <>
          <div className="app-content__heading app-content__heading--section">
            <h2>{pageTitle}</h2>
          </div>
          <InformationPanel
            title="Vos cours confirmés apparaîtront ici"
            description="Cette vue présentera vos inscriptions et leur progression à partir de la liste chargée depuis l’accueil."
          />
        </>
      )}
    </AppShell>
  )
}
