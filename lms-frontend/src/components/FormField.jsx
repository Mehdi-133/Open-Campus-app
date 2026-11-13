import { useState } from 'react'

export default function FormField({ label, id, error, hint, type = 'text', ...props }) {
  const [visible, setVisible] = useState(false)
  const password = type === 'password'
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    <div className="input-wrap">
      <input id={id} type={password && visible ? 'text' : type} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} {...props} />
      {password && <button type="button" className="password-toggle" aria-controls={id} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? 'Masquer' : 'Afficher'}<span className="sr-only"> le mot de passe</span></button>}
    </div>
    {hint && <small id={`${id}-hint`}>{hint}</small>}
    {error && <small className="field-error" id={`${id}-error`}>{error}</small>}
  </div>
}
