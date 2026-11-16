const ROLE_LABELS = {
  admin: 'Administrateur',
  trainer: 'Formateur',
  learner: 'Apprenant',
}

const STATUS_LABELS = {
  active: 'Actif',
  suspended: 'Suspendu',
}

const STATUS_TONES = {
  active: 'active',
  suspended: 'suspended',
}

function labelFor(labels, value) {
  return labels[value] || value || 'Non renseigné'
}

function initialFor(user) {
  const source = user.name?.trim() || user.email?.trim() || '?'

  return source.slice(0, 1).toUpperCase()
}

export function UserList({ users }) {
  return (
    <ul className="user-list">
      {users.map((user) => {
        const roleLabel = labelFor(ROLE_LABELS, user.role)
        const statusLabel = labelFor(STATUS_LABELS, user.status)
        const statusTone = STATUS_TONES[user.status] || 'neutral'

        return (
          <li className="user-card" key={user.id}>
            <span className="user-card__avatar" aria-hidden="true">{initialFor(user)}</span>
            <div className="user-card__identity">
              <h4>{user.name?.trim() || user.email || 'Compte sans nom'}</h4>
              <p>{user.email || 'Adresse e-mail non renseignée'}</p>
            </div>
            <div className="user-card__meta">
              <div className="user-card__field">
                <span className="user-card__label">Rôle</span>
                <span className="status-badge status-badge--role">{roleLabel}</span>
              </div>
              <div className="user-card__field">
                <span className="user-card__label">Statut</span>
                <span className={`status-badge status-badge--${statusTone}`}>
                  <span className="status-badge__dot" aria-hidden="true" />
                  {statusLabel}
                </span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
