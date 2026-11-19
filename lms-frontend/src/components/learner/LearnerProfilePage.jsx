import { initialFor, labelFor, ROLE_LABELS, STATUS_LABELS } from '../users/userLabels.js'

const STATUS_TONES = {
  active: 'active',
  suspended: 'suspended',
}

// Read-only profile built from the session profile certified by GET /api/auth/me.
// No editing yet: the backend exposes no validated profile-update contract.
export function LearnerProfilePage({ user }) {
  const displayName = user.name?.trim() || user.email || 'Compte sans nom'
  const statusLabel = labelFor(STATUS_LABELS, user.status)
  const statusTone = STATUS_TONES[user.status] || 'neutral'

  return (
    <section className="profile-grid" aria-label="Mon profil">
      <article className="profile-card">
        <p className="eyebrow">MON PROFIL</p>

        <div className="profile-card__identity">
          <span className="profile-card__avatar" aria-hidden="true">{initialFor(user)}</span>
          <div>
            <h3>{displayName}</h3>
            <p className="profile-card__email">{user.email || 'Adresse e-mail non renseignée'}</p>
          </div>
        </div>

        <dl className="profile-card__list">
          <div className="profile-card__row">
            <dt>Rôle</dt>
            <dd>{labelFor(ROLE_LABELS, user.role)}</dd>
          </div>
          <div className="profile-card__row">
            <dt>Statut du compte</dt>
            <dd>
              <span className={`status-badge status-badge--${statusTone}`}>
                <span className="status-badge__dot" aria-hidden="true" />
                {statusLabel}
              </span>
            </dd>
          </div>
        </dl>

        <p className="profile-card__note">
          Ces informations proviennent de votre compte certifié par le serveur à la connexion.
          Le mot de passe n’est jamais affiché.
        </p>
      </article>

      <aside className="dashboard-side-card dashboard-side-card--learner">
        <span className="dashboard-side-card__icon" aria-hidden="true">✦</span>
        <h3>Un profil à jour</h3>
        <p>
          Votre nom, votre adresse e-mail et votre rôle sont ceux confirmés par le serveur.
          Contactez un administrateur si l’une de ces informations doit être corrigée.
        </p>
      </aside>
    </section>
  )
}
