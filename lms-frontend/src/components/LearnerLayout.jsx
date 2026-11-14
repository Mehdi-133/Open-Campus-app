import { AppShell } from './AppShell.jsx'

const navigation = [
  { id: 'overview', label: 'Accueil', icon: 'home' },
  { id: 'courses', label: 'Mes cours', icon: 'courses' },
  { id: 'profile', label: 'Mon profil', icon: 'profile' },
]

export function LearnerLayout({ activeView, user }) {
  const firstName = user.name?.trim().split(/\s+/)[0]

  return (
    <AppShell activeView={activeView} navigation={navigation} roleLabel="Apprenant" user={user}>
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
          </div>
          <div className="empty-course-card">
            <span className="empty-course-card__icon" aria-hidden="true">▤</span>
            <div><h4>Vos cours apparaîtront ici</h4><p>Les cours seront affichés à partir de vos inscriptions confirmées.</p></div>
          </div>
        </section>
      </section>
    </AppShell>
  )
}
