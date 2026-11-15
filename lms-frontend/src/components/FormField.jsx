export function FormField({
  autoComplete,
  endAdornment,
  error,
  id,
  label,
  name,
  onChange,
  type = 'text',
  value,
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="form-field__input-wrap">
        <input
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          id={id}
          name={name}
          onChange={onChange}
          type={type}
          value={value}
        />
        {endAdornment}
      </div>
      {error ? <p className="form-field__error" id={`${id}-error`}>{error}</p> : null}
    </div>
  )
}
