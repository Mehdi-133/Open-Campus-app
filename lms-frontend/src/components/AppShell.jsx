function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <path d="m4 13 12-7 12 7-12 7-12-7Zm5 3v6c4 3 10 3 14 0v-6l-7 4-7-4Zm18-1v7" />
      </svg>
    </span>
  )
}

const navigationIcons = {
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  courses: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5v-18Z" /><path d="M4 18a2.5 2.5 0 0 1 2.5-2.5H20M8 6h7" /></>,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
}

function NavigationIcon({ name }) {
  return (
    <svg className="app-navigation__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {navigationIcons[name] || navigationIcons.home}
    </svg>
  )
}

export function AppShell({ activeView, navigation, onNavigate, roleLabel, user, children }) {
  const currentPage = navigation.find((item) => item.id === activeView) || navigation[0]
  const displayName = user.name || user.email

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-brand"><BrandMark /><span>Open Campus</span></div>
        <nav className="app-navigation" aria-label="Navigation principale">
          {navigation.map((item) => (
            <button
              aria-current={item.id === currentPage.id ? 'page' : undefined}
              className={`app-navigation__item${item.id === currentPage.id ? ' is-active' : ''}`}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <NavigationIcon name={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="app-sidebar__note">Apprendre, à votre rythme.</div>
      </aside>

      <div className="app-main">
        <header className="app-header">
          <div className="app-header__title">
            <span className="app-header__context">{roleLabel} / Espace de travail</span>
            <h1>{currentPage.label}</h1>
          </div>
          <div className="account-chip" role="group" aria-label={`Compte ${displayName} — ${roleLabel}`}>
            <span className="account-chip__avatar" aria-hidden="true">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <span className="account-chip__identity">
              <strong>{displayName}</strong>
              <span>{roleLabel}</span>
            </span>
          </div>
        </header>
        <main className="app-content">
          <div className="app-content__heading">
            <p className="eyebrow">{roleLabel === 'Admin' ? 'PORTAIL ADMINISTRATEUR' : 'VOTRE APPRENTISSAGE'}</p>
            <h2>{currentPage.label}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
