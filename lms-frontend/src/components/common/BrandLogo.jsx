export function BrandLogo({ light = false }) {
  return (
    <div className={`brand-logo${light ? ' brand-logo--light' : ''}`}>
      <span className="brand-logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <path d="m3 12 13-7 13 7-13 7-13-7Z" />
          <path d="M9 16v7c4 4 10 4 14 0v-7M29 12v9" />
        </svg>
      </span>
      <span>Open Campus</span>
    </div>
  )
}
