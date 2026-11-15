import { useState } from 'react'
import { getCurrentUser, login } from './api/auth.js'
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
          <div className="auth-card__story" aria-hidden="true">
            <span className="brand-mark">OC</span>
            <p>Votre parcours commence ici.</p>
          </div>
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
