import { useState } from 'react'
import { getAdminUsers } from './api/adminUsers.js'
import { getCurrentUser, login } from './api/auth.js'
import { getMyEnrollments } from './api/enrollments.js'
import { ApiError } from './api/client.js'
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

  function handleLogout() {
    setSession(null)
    setActiveView('overview')
  }

  // eslint-disable-next-line no-unused-vars
  function handleProtectedError(error) {
    if (error?.status === 401) {
      handleLogout()
    }
    throw error
  }

  // A 401 on an established session purges it and returns to the login screen.
  // A 403 keeps the session and is rendered as "Accès refusé" by the calling view.
  async function handleLoadEnrollments() {
    if (!session?.token) {
      throw new ApiError('Session expirée. Reconnectez-vous.', 401)
    }

    try {
      return await getMyEnrollments(session.token)
    } catch (error) {
      if (error?.status === 401) {
        handleLogout()
      }

      throw error
    }
  }

  // The admin guard stays client-side for rendering only; the server also enforces it.
  // A 401 purges the session; a 403 preserves it and is rendered as "Accès refusé".
  async function handleLoadUsers() {
    if (!session?.token || session.user.role !== 'admin') {
      throw new ApiError('Accès refusé.', 403)
    }

    try {
      return await getAdminUsers(session.token)
    } catch (error) {
      if (error?.status === 401) {
        handleLogout()
      }

      throw error
    }
  }

  // OCF-45: creation is a callback-only form. No Admin creation route is mounted,
  // so this rejects explicitly instead of calling /register or a guessed URL.
  // OCF-46 can replace this stub once the server contract is validated.
  async function handleCreateUser() {
    throw new ApiError(
      'La création de compte Admin n’est pas disponible : le contrat serveur n’est pas validé. Votre saisie a été conservée.',
    )
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

    return <AdminLayout activeView={currentView} onCreateUser={handleCreateUser} onLoadUsers={handleLoadUsers} onLogout={handleLogout} onNavigate={setActiveView} user={session.user} />
  }

  if (session.user.role === 'learner') {
    const currentView = LEARNER_NAVIGATION.some((item) => item.id === activeView)
      ? activeView
      : LEARNER_NAVIGATION[0].id

    return <LearnerLayout activeView={currentView} onLoadEnrollments={handleLoadEnrollments} onLogout={handleLogout} onNavigate={setActiveView} user={session.user} />
  }

  return <UnsupportedRoleNotice onLogout={handleLogout} role={session.user.role} />
}

export default App
