import { useState } from 'react'
import { getAdminCourses } from './api/adminCourses.js'
import { createAdminUser, getAdminUsers, updateAdminUser } from './api/adminUsers.js'
import { getCurrentUser, login } from './api/auth.js'
import { getMyEnrollments } from './api/enrollments.js'
import { ApiError } from './api/client.js'
import { BrandLogo } from './components/common/BrandLogo.jsx'
import { AdminLayout } from './components/layout/AdminLayout.jsx'
import { LearnerLayout } from './components/layout/LearnerLayout.jsx'
import { UnsupportedRoleNotice } from './components/common/UnsupportedRoleNotice.jsx'
import { ADMIN_NAVIGATION, LEARNER_NAVIGATION } from './components/layout/navigation.js'
import { LoginForm } from './components/auth/LoginForm.jsx'
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

  // The Admin catalogue is loaded only from the page's explicit button. A 401
  // purges the session; a 403 preserves it and is rendered as "Accès refusé".
  async function handleLoadCourses() {
    if (!session?.token || session.user.role !== 'admin') {
      throw new ApiError('Accès refusé.', 403)
    }

    try {
      return await getAdminCourses(session.token)
    } catch (error) {
      if (error?.status === 401) {
        handleLogout()
      }

      throw error
    }
  }

  // Account creation is an explicit submit event: the shared API layer owns the
  // POST. A 401 purges the session; a 403 preserves it and is shown as "Accès refusé".
  async function handleCreateUser(values) {
    if (!session?.token || session.user.role !== 'admin') {
      throw new ApiError('Accès refusé.', 403)
    }

    try {
      return await createAdminUser(session.token, values)
    } catch (error) {
      if (error?.status === 401) {
        handleLogout()
      }

      throw error
    }
  }

  // Account edits are explicit submit events: the shared API layer owns the PATCH.
  // A 401 purges the session; a 403 preserves it and is shown as "Accès refusé".
  async function handleUpdateUser(id, values) {
    if (!session?.token || session.user.role !== 'admin') {
      throw new ApiError('Accès refusé.', 403)
    }

    try {
      return await updateAdminUser(session.token, id, values)
    } catch (error) {
      if (error?.status === 401) {
        handleLogout()
      }

      throw error
    }
  }

  if (!session?.user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <aside className="auth-card__story">
            <BrandLogo light />
            <div className="auth-card__art" aria-hidden="true">
              <svg viewBox="0 0 64 64" focusable="false">
                <path d="m8 26 24-14 24 14-24 14-24-14Z" />
                <path d="M18 33v14c8 8 20 8 28 0V33" />
                <path d="M56 26v20" />
              </svg>
            </div>
            <div className="auth-card__story-copy">
              <h2>Votre prochain chapitre commence ici.</h2>
              <p>Un espace pour les esprits curieux. Apprenez quelque chose qui vous restera.</p>
            </div>
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

    return <AdminLayout activeView={currentView} onCreateUser={handleCreateUser} onLoadCourses={handleLoadCourses} onLoadUsers={handleLoadUsers} onLogout={handleLogout} onNavigate={setActiveView} onUpdateUser={handleUpdateUser} user={session.user} />
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
