import { useState } from 'react'
import Button from './Button'
import FormField from './FormField'
import Notice from './Notice'

export default function LoginForm({ onSubmit, onRegister, initialEmail = '', notice }) {
  const [values, setValues] = useState({ email: initialEmail, password: '' })
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (pending) return
    const next = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'Saisissez une adresse e-mail valide.'
    if (!values.password) next.password = 'Saisissez votre mot de passe.'
    setErrors(next)
    setError('')
    if (Object.keys(next).length) return
    setPending(true)
    try { await onSubmit({ email: values.email.trim().toLowerCase(), password: values.password }) }
    catch (failure) { setError(failure.message); setErrors(Object.fromEntries((failure.errors || []).map(item => [item.field, item.message]))) }
    finally { setPending(false) }
  }

  return <><span className="eyebrow">BIENVENUE SUR OPEN CAMPUS</span><h1>Heureux de vous revoir.</h1><p className="intro">Connectez-vous pour retrouver votre espace.</p>
    <Notice kind="success">{notice}</Notice>
    <form noValidate onSubmit={handleSubmit} aria-busy={pending}>
      <fieldset disabled={pending}>
        <FormField label="Adresse e-mail" id="login-email" type="email" autoComplete="username" required value={values.email} onChange={e => setValues({ ...values, email: e.target.value })} error={errors.email} />
        <FormField label="Mot de passe" id="login-password" type="password" autoComplete="current-password" required value={values.password} onChange={e => setValues({ ...values, password: e.target.value })} error={errors.password} />
        <Notice>{error}</Notice>
        <Button type="submit" disabled={pending}>{pending ? 'Connexion en cours…' : 'Se connecter'}<span aria-hidden="true"> →</span></Button>
      </fieldset>
    </form>
    <p className="auth-switch">Pas encore de compte ? <button className="text-button" disabled={pending} onClick={onRegister}>Créer un compte</button></p>
  </>
}
