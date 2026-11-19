import { useState } from 'react'
import { FormField } from '../common/FormField.jsx'
import { ROLE_LABELS, STATUS_LABELS } from './userLabels.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CREATE_FIELDS = ['name', 'email', 'password']
const EDIT_FIELDS = ['name', 'email', 'role', 'status']

function startingValues(mode, initialValues) {
  if (mode === 'edit') {
    return {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      role: initialValues?.role || 'learner',
      status: initialValues?.status || 'active',
    }
  }

  return { name: '', email: '', password: '' }
}

function validate(values, mode) {
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

  if (mode === 'create') {
    if (!values.password) {
      errors.password = 'Le mot de passe est obligatoire.'
    } else if (values.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères.'
    }
  }

  return errors
}

// The shared error contract sends 400 details as [{ field, message }].
function readServerErrors(error, mode) {
  const fieldErrors = {}
  const otherMessages = []
  const editableFields = mode === 'edit' ? EDIT_FIELDS : CREATE_FIELDS

  for (const issue of Array.isArray(error?.errors) ? error.errors : []) {
    const field = typeof issue?.field === 'string' ? issue.field.split('.')[0] : ''
    const message = issue?.message || 'Valeur invalide.'

    if (editableFields.includes(field)) {
      fieldErrors[field] = message
    } else {
      otherMessages.push(message)
    }
  }

  return { fieldErrors, otherMessages }
}

function SelectField({ error, id, label, name, onChange, options, value }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <select
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={Boolean(error)}
        id={id}
        name={name}
        onChange={onChange}
        value={value}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
      {error ? <p className="form-field__error" id={`${id}-error`}>{error}</p> : null}
    </div>
  )
}

export function UserForm({ initialValues, mode = 'create', onCancel, onSubmit }) {
  const isEdit = mode === 'edit'
  const [values, setValues] = useState(() => startingValues(mode, initialValues))
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

  function handleReset() {
    setValues(startingValues(mode, initialValues))
    setErrors({})
    setSubmitError('')
    setIsPasswordVisible(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const nextErrors = validate(values, mode)
    setErrors(nextErrors)
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    const payload = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      ...(isEdit
        ? { role: values.role, status: values.status }
        : { password: values.password }),
    }

    try {
      await onSubmit(payload)

      // No reset and no success message here: only the parent may change the
      // list, and only after the server has confirmed the request.
    } catch (error) {
      if (error?.status === 409) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          email: 'Cette adresse e-mail est déjà utilisée.',
        }))
        setSubmitError('Conflit : cette adresse e-mail est déjà utilisée. Votre saisie a été conservée.')
      } else if (error?.status === 400) {
        const { fieldErrors, otherMessages } = readServerErrors(error, mode)

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
        setSubmitError(
          error?.message
            || `${isEdit ? 'La modification' : 'La création'} a échoué. Votre saisie a été conservée.`,
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldPrefix = isEdit ? 'edit-user' : 'new-user'

  return (
    <form className="user-form" noValidate onSubmit={handleSubmit}>
      <p className="user-form__note">
        Les champs sont vérifiés avant l’envoi. En cas de refus du serveur, votre saisie reste visible.
      </p>

      <FormField
        autoComplete="name"
        error={errors.name}
        id={`${fieldPrefix}-name`}
        label="Nom complet"
        name="name"
        onChange={updateField}
        value={values.name}
      />
      <FormField
        autoComplete="username"
        error={errors.email}
        id={`${fieldPrefix}-email`}
        label="Adresse e-mail"
        name="email"
        onChange={updateField}
        type="email"
        value={values.email}
      />

      {isEdit ? (
        <>
          <SelectField
            error={errors.role}
            id="edit-user-role"
            label="Rôle"
            name="role"
            onChange={updateField}
            options={Object.entries(ROLE_LABELS)}
            value={values.role}
          />
          <SelectField
            error={errors.status}
            id="edit-user-status"
            label="Statut du compte"
            name="status"
            onChange={updateField}
            options={Object.entries(STATUS_LABELS)}
            value={values.status}
          />
        </>
      ) : (
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
      )}

      {submitError ? <p className="user-form__submit-error" role="alert">{submitError}</p> : null}

      <div className="user-form__actions">
        <button className="user-form__submit" disabled={isSubmitting} type="submit">
          {isSubmitting
            ? (isEdit ? 'Enregistrement…' : 'Création en cours…')
            : (isEdit ? 'Enregistrer les modifications' : 'Créer le compte')}
        </button>
        {isEdit ? (
          <button className="user-form__reset" onClick={handleReset} type="button">
            Réinitialiser
          </button>
        ) : null}
        {onCancel ? (
          <button className="user-form__cancel" onClick={onCancel} type="button">
            Annuler
          </button>
        ) : null}
      </div>
    </form>
  )
}
