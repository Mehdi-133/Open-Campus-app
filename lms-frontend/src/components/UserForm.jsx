import { useState } from 'react'
import { FormField } from './FormField.jsx'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EDITABLE_FIELDS = ['name', 'email', 'password']

function validate(values) {
  const errors = {}

  if (!values.name.trim()) {
    errors.name = 'Le nom est obligatoire.'
  } else if (values.name.trim().length < 2) {
    errors.name = 'Le nom doit contenir au moins 2 caractères.'
  }

  if (!values.email.trim()) {
    errors.email = 'L’adresse e-mail est obligatoire.'
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Saisissez une adresse e-mail valide.'
  }

  if (!values.password) {
    errors.password = 'Le mot de passe est obligatoire.'
  } else if (values.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères.'
  }

  return errors
}

// The shared error contract sends 400 details as [{ field, message }].
function readServerErrors(error) {
  const fieldErrors = {}
  const otherMessages = []

  for (const issue of Array.isArray(error?.errors) ? error.errors : []) {
    const field = typeof issue?.field === 'string' ? issue.field.split('.')[0] : ''
    const message = issue?.message || 'Valeur invalide.'

    if (EDITABLE_FIELDS.includes(field)) {
      fieldErrors[field] = message
    } else {
      otherMessages.push(message)
    }
  }

  return { fieldErrors, otherMessages }
}

export function UserForm({ onCancel, onSubmit }) {
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  function updateField(event) {
    const { name, value } = event.target

    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[name]
      return nextErrors
    })
    setSubmitError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      })

      // No reset and no success message here: only the parent may add an account,
      // and only after the server has confirmed the creation.
    } catch (error) {
      if (error?.status === 409) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          email: 'Cette adresse e-mail est déjà utilisée.',
        }))
        setSubmitError('Conflit : cette adresse e-mail est déjà utilisée. Votre saisie a été conservée.')
      } else if (error?.status === 400) {
        const { fieldErrors, otherMessages } = readServerErrors(error)

        if (Object.keys(fieldErrors).length > 0) {
          setErrors((currentErrors) => ({ ...currentErrors, ...fieldErrors }))
        }

        setSubmitError(
          otherMessages.length > 0
            ? otherMessages.join(' ')
            : 'Corrigez les champs signalés par le serveur. Votre saisie a été conservée.',
        )
      } else if (error?.status === 403) {
        setSubmitError('Accès refusé. Votre session reste active. Votre saisie a été conservée.')
      } else {
        setSubmitError(error?.message || 'La création a échoué. Votre saisie a été conservée.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="user-form" noValidate onSubmit={handleSubmit}>
      <p className="user-form__note">
        Les champs sont vérifiés avant l’envoi. En cas de refus du serveur, votre saisie reste visible.
      </p>

      <FormField
        autoComplete="name"
        error={errors.name}
        id="new-user-name"
        label="Nom complet"
        name="name"
        onChange={updateField}
        value={values.name}
      />
      <FormField
        autoComplete="username"
        error={errors.email}
        id="new-user-email"
        label="Adresse e-mail"
        name="email"
        onChange={updateField}
        type="email"
        value={values.email}
      />
      <FormField
        autoComplete="new-password"
        error={errors.password}
        id="new-user-password"
        label="Mot de passe"
        name="password"
        onChange={updateField}
        endAdornment={(
          <button
            aria-controls="new-user-password"
            aria-pressed={isPasswordVisible}
            className="password-toggle"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            type="button"
          >
            {isPasswordVisible ? 'Masquer' : 'Afficher'}
          </button>
        )}
        type={isPasswordVisible ? 'text' : 'password'}
        value={values.password}
      />

      {submitError ? <p className="user-form__submit-error" role="alert">{submitError}</p> : null}

      <div className="user-form__actions">
        <button className="user-form__submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Création en cours…' : 'Créer le compte'}
        </button>
        {onCancel ? (
          <button className="user-form__cancel" onClick={onCancel} type="button">
            Annuler
          </button>
        ) : null}
      </div>
    </form>
  )
}
