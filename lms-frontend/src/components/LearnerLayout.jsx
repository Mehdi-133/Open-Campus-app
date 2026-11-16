import { AppShell } from './AppShell.jsx'
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

function LearnerDashboard({ onNavigate, user }) {
  const firstName = user.name?.trim().split(/\s+/)[0]

  return (
    <section className="dashboard-grid" aria-label="Espace apprenant">
      <article className="dashboard-hero">
        <p className="dashboard-hero__eyebrow">VOTRE PARCOURS OPEN CAMPUS</p>
        <h3>{firstName ? `Bonjour ${firstName}, prêt à poursuivre votre apprentissage ?` : 'Prêt à poursuivre votre apprentissage ?'}</h3>
        <p>Vos cours et votre progression apparaîtront ici à partir des informations de votre compte.</p>
      </article>
      <aside className="dashboard-side-card dashboard-side-card--learner">
        <span className="dashboard-side-card__icon" aria-hidden="true">✦</span>
        <h3>Un pas à la fois</h3>
        <p>Retrouvez vos cours dès que vos inscriptions sont disponibles.</p>
      </aside>
      <section className="dashboard-section">
        <div className="dashboard-section__heading">
          <div><p className="eyebrow">VOTRE APPRENTISSAGE</p><h3>Mes cours</h3></div>
          <button className="section-link" type="button" onClick={() => onNavigate('courses')}>
            Voir mes cours <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="empty-course-card">
          <span className="empty-course-card__icon" aria-hidden="true">▤</span>
          <div><h4>Vos cours apparaîtront ici</h4><p>Les cours seront affichés à partir de vos inscriptions confirmées.</p></div>
        </div>
      </section>
    </section>
  )
}

export function LearnerLayout({ activeView, onLogout, onNavigate, user }) {
  const pageTitle = LEARNER_NAVIGATION.find((item) => item.id === activeView)?.label

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
        <LearnerDashboard onNavigate={onNavigate} user={user} />
      ) : activeView === 'profile' ? (
        <LearnerProfilePage user={user} />
      ) : (
        <>
          <div className="app-content__heading app-content__heading--section">
            <h2>{pageTitle}</h2>
          </div>
          <InformationPanel
            title="Vos cours confirmés apparaîtront ici"
            description="Cette vue sera reliée à vos inscriptions lorsque le chargement des cours sera ajouté."
          />
        </>
      )}
    </AppShell>
  )
}
