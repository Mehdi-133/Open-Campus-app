import { useState } from 'react'
import { AdminLayout } from './components/AdminLayout.jsx'
import { LearnerLayout } from './components/LearnerLayout.jsx'
import { ADMIN_NAVIGATION, LEARNER_NAVIGATION } from './components/navigation.js'
import './App.css'

function App() {
  const [session] = useState(null)
  const [activeView, setActiveView] = useState('overview')

  if (!session?.user) {
    return (
      <main className="session-placeholder">
        <span className="brand-mark" aria-hidden="true">OC</span>
        <p className="eyebrow">OPEN CAMPUS</p>
        <h1>Votre espace de formation</h1>
        <p>Connectez-vous pour afficher les informations associées à votre compte.</p>
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

  return (
    <main className="session-placeholder">
      <span className="brand-mark" aria-hidden="true">OC</span>
      <p className="eyebrow">ESPACE INDISPONIBLE</p>
      <h1>Ce rôle n’est pas encore pris en charge</h1>
      <p>Les outils formateur ne sont pas disponibles dans cette version.</p>
    </main>
  )
}

export default App
