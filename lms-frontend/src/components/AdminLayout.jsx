import { AppShell } from './AppShell.jsx'
import { ADMIN_NAVIGATION } from './navigation.js'

function InformationPanel({ title, description }) {
  return (
    <section className="information-panel" aria-live="polite">
      <span className="information-panel__icon" aria-hidden="true">i</span>
      <div><h3>{title}</h3><p>{description}</p></div>
    </section>
  )
}

function AdminDashboard({ onNavigate }) {
  return (
    <section className="dashboard-grid" aria-label="Espace administrateur">
      <article className="dashboard-hero dashboard-hero--admin">
        <p className="dashboard-hero__eyebrow">OPEN CAMPUS · ADMIN</p>
        <h3>Faites grandir votre communauté d’apprentissage.</h3>
        <p>Retrouvez les espaces de gestion des utilisateurs et des cours.</p>
      </article>
      <aside className="dashboard-side-card">
        <span className="dashboard-side-card__icon" aria-hidden="true">✦</span>
        <h3>Votre espace admin</h3>
        <p>Les outils disponibles dépendent des autorisations confirmées par le serveur.</p>
      </aside>
      <section className="dashboard-section">
        <div className="dashboard-section__heading">
          <div><p className="eyebrow">GESTION DE LA PLATEFORME</p><h3>Vos espaces</h3></div>
        </div>
        <div className="management-grid">
          <button className="management-card" type="button" onClick={() => onNavigate('users')}>
            <span className="management-card__icon management-card__icon--mint" aria-hidden="true">♙</span>
            <h4>Utilisateurs</h4>
            <p>Accédez aux comptes et aux rôles de la plateforme.</p>
            <span className="management-card__arrow" aria-hidden="true">→</span>
          </button>
          <button className="management-card" type="button" onClick={() => onNavigate('courses')}>
            <span className="management-card__icon management-card__icon--yellow" aria-hidden="true">▤</span>
            <h4>Cours</h4>
            <p>Accédez au catalogue de cours.</p>
            <span className="management-card__arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </section>
  )
}

export function AdminLayout({ activeView, onLogout, onNavigate, user }) {
  const pageTitle = ADMIN_NAVIGATION.find((item) => item.id === activeView)?.label

  return (
    <AppShell
      activeView={activeView}
      navigation={ADMIN_NAVIGATION}
      onLogout={onLogout}
      onNavigate={onNavigate}
      roleLabel="Admin"
      user={user}
    >
      {activeView === 'overview' ? (
        <AdminDashboard onNavigate={onNavigate} />
      ) : (
        <>
          <div className="app-content__heading app-content__heading--section">
            <h2>{pageTitle}</h2>
          </div>
          <InformationPanel
            title={activeView === 'users' ? 'Gestion des utilisateurs' : 'Catalogue des cours'}
            description={activeView === 'users'
              ? 'La liste sera reliée quand le contrat API d’administration sera disponible.'
              : 'Le catalogue administrateur sera relié à un contrat qui expose les cours selon les autorisations confirmées.'}
          />
        </>
      )}
    </AppShell>
  )
}
