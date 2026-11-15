import { useState } from 'react'
import { getCurrentUser, login } from './api/auth.js'
import { BrandLogo } from './components/BrandLogo.jsx'
import { AdminLayout } from './components/AdminLayout.jsx'
import { LearnerLayout } from './components/LearnerLayout.jsx'
import { UnsupportedRoleNotice } from './components/UnsupportedRoleNotice.jsx'
import { ADMIN_NAVIGATION, LEARNER_NAVIGATION } from './components/navigation.js'
import { LoginForm } from './components/LoginForm.jsx'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [activeView, setActiveView] = useState('overview')

  async function handleLogin(credentials) {
    const token = await login(credentials)
    const user = await getCurrentUser(token)

    setSession({ token, user })
  }

  if (!session?.user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <aside className="auth-card__story">
            <BrandLogo light />
            <div className="auth-card__story-copy">
              <p className="auth-card__overline">UNE NOUVELLE FAÇON D’APPRENDRE</p>
              <h2>Apprenez à votre rythme, allez plus loin.</h2>
              <p>Des parcours clairs, des ressources utiles et un espace conçu pour vous faire avancer.</p>
            </div>
            <div className="learning-preview" aria-hidden="true">
              <div className="learning-preview__back-card"><span>✦</span><strong>Explorer</strong><small>De nouvelles idées</small></div>
              <div className="learning-preview__front-card">
                <span className="learning-preview__badge">OPEN CAMPUS</span>
                <strong>Votre prochain chapitre commence ici.</strong>
                <div className="learning-preview__progress"><span /></div>
              </div>
            </div>
            <p className="auth-card__quote">Faites de la place pour votre prochaine idée.</p>
          </aside>
          <div className="auth-card__form">
            <LoginForm onSubmit={handleLogin} />
          </div>
        </section>
      </main>
    )
  }

  if (session.user.role === 'admin') {
    const currentView = ADMIN_NAVIGATION.some((item) => item.id === activeView)
      ? activeView
      : ADMIN_NAVIGATION[0].id

    return <AdminLayout activeView={currentView} onNavigate={setActiveView} user={session.user} />
  }

  if (session.user.role === 'learner') {
    const currentView = LEARNER_NAVIGATION.some((item) => item.id === activeView)
      ? activeView
      : LEARNER_NAVIGATION[0].id

    return <LearnerLayout activeView={currentView} onNavigate={setActiveView} user={session.user} />
  }

  return <UnsupportedRoleNotice role={session.user.role} />
}

export default App
