export default function Notice({ children, kind = 'error' }) {
  if (!children) return null
  return <div className={`notice notice--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>{children}</div>
}
