import { initialFor, labelFor, ROLE_LABELS, STATUS_LABELS } from './userLabels.js'

// Detail view for the selected row. The parent owns selectedId and passes the user down.
export function UserDetailsPanel({ onClose, onEdit, user }) {
  if (!user) {
    return (
      <aside aria-label="Fiche utilisateur" className="user-details user-details--empty">
        <h3>Fiche du compte</h3>
        <p>Sélectionnez un compte dans la liste pour afficher sa fiche.</p>
      </aside>
    )
  }

  const displayName = user.name?.trim() || user.email || 'Compte sans nom'

  return (
    <aside aria-label="Fiche utilisateur" aria-live="polite" className="user-details">
      <div className="user-details__header">
        <h3>Fiche du compte</h3>
        <button
          aria-label="Fermer la fiche"
          className="user-details__close"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>
      </div>

      <div className="user-details__identity">
        <span className="user-details__avatar" aria-hidden="true">{initialFor(user)}</span>
        <div>
          <h4>{displayName}</h4>
          <p>{user.email || 'Adresse e-mail non renseignée'}</p>
        </div>
      </div>

      <dl className="user-details__list">
        <div className="user-details__row">
          <dt>Rôle</dt>
          <dd>{labelFor(ROLE_LABELS, user.role)}</dd>
        </div>
        <div className="user-details__row">
          <dt>Statut du compte</dt>
          <dd>{labelFor(STATUS_LABELS, user.status)}</dd>
        </div>
      </dl>

      <p className="user-details__note">
        Le mot de passe n’est jamais renvoyé par l’API et n’apparaît donc jamais ici.
      </p>

      {onEdit ? (
        <div className="user-details__actions">
          <button className="user-details__edit" onClick={() => onEdit(user)} type="button">
            Modifier le compte
          </button>
        </div>
      ) : null}
    </aside>
  )
}
