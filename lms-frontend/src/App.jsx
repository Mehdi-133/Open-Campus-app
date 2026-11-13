import { useState } from 'react'
import AuthLayout from './components/AuthLayout'
import LoginForm from './components/LoginForm'
import './App.css'

function App() {
  const [view, setView] = useState('login')
  return <AuthLayout>{view === 'login' ? <LoginForm onSubmit={async () => { throw new Error('Connexion en cours de configuration.') }} onRegister={() => setView('register')} /> : <><h1>Créer un compte</h1><p>Le formulaire arrive à la prochaine étape.</p><button className="text-button" onClick={() => setView('login')}>Retour à la connexion</button></>}</AuthLayout>
}
export default App
