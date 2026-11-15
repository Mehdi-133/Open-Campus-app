import { useState } from 'react'
import { FormField } from './FormField.jsx'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}

  if (!values.email.trim()) {
    errors.email = 'L’adresse e-mail est obligatoire.'
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Saisissez une adresse e-mail valide.'
  }

  if (!values.password) {
    errors.password = 'Le mot de passe est obligatoire.'
  }

  return errors
}

export function LoginForm({ onSubmit }) {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors }
      delete nextErrors[name]
      return nextErrors
    })
    setSubmitError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0 || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      })
    } catch (error) {
      setSubmitError(error.message || 'La connexion a échoué. Réessayez.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="login-form" noValidate onSubmit={handleSubmit}>
      <div className="login-form__heading">
        <p className="eyebrow">OPEN CAMPUS</p>
        <h1>Bon retour parmi nous</h1>
        <p>Connectez-vous pour retrouver votre espace de formation.</p>
      </div>

      <FormField
        autoComplete="username"
        error={errors.email}
        id="login-email"
        label="Adresse e-mail"
        name="email"
        onChange={updateField}
        type="email"
        value={values.email}
      />
      <FormField
        autoComplete="current-password"
        error={errors.password}
        id="login-password"
        label="Mot de passe"
        name="password"
        onChange={updateField}
        type="password"
        value={values.password}
      />

      {submitError ? <p className="login-form__submit-error" role="alert">{submitError}</p> : null}

      <button className="login-form__submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Connexion en cours…' : 'Se connecter'}
      </button>
    </form>
  )
}
