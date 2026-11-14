import { AppShell } from './AppShell.jsx'

const navigation = [
  { id: 'overview', label: 'Vue d’ensemble', icon: 'home' },
  { id: 'users', label: 'Utilisateurs', icon: 'users' },
  { id: 'courses', label: 'Cours', icon: 'courses' },
]

export function AdminLayout({ activeView, user }) {
  return (
    <AppShell activeView={activeView} navigation={navigation} roleLabel="Admin" user={user}>
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
            <article className="management-card">
              <span className="management-card__icon management-card__icon--mint" aria-hidden="true">♙</span>
              <h4>Utilisateurs</h4>
              <p>Accédez aux comptes et aux rôles de la plateforme.</p>
            </article>
            <article className="management-card">
              <span className="management-card__icon management-card__icon--yellow" aria-hidden="true">▤</span>
              <h4>Cours</h4>
              <p>Accédez au catalogue de cours.</p>
            </article>
          </div>
        </section>
      </section>
    </AppShell>
  )
}
