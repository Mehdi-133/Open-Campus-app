import { initialFor, labelFor, ROLE_LABELS, STATUS_LABELS } from './userLabels.js'

const STATUS_TONES = {
  active: 'active',
  suspended: 'suspended',
}

export function UserList({ onSelectUser, selectedId, users }) {
  return (
    <ul className="user-list">
      {users.map((user) => {
        const roleLabel = labelFor(ROLE_LABELS, user.role)
        const statusLabel = labelFor(STATUS_LABELS, user.status)
        const statusTone = STATUS_TONES[user.status] || 'neutral'
        const isSelected = user.id === selectedId
        const displayName = user.name?.trim() || user.email || 'Compte sans nom'

        return (
          <li className={`user-card${isSelected ? ' is-selected' : ''}`} key={user.id}>
            <span className="user-card__avatar" aria-hidden="true">{initialFor(user)}</span>
            <div className="user-card__identity">
              <h4>{displayName}</h4>
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
            <button
              aria-label={`${isSelected ? 'Masquer' : 'Afficher'} la fiche de ${displayName}`}
              aria-pressed={isSelected}
              className="user-card__select"
              onClick={() => onSelectUser(user.id)}
              type="button"
            >
              {isSelected ? 'Fiche affichée' : 'Voir la fiche'}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
