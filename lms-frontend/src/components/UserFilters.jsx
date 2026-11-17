const ROLE_OPTIONS = [
  { value: 'all', label: 'Tous les rôles' },
  { value: 'admin', label: 'Administrateur' },
  { value: 'trainer', label: 'Formateur' },
  { value: 'learner', label: 'Apprenant' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'active', label: 'Actif' },
  { value: 'suspended', label: 'Suspendu' },
]

function countLabel(visibleCount, totalCount) {
  const base = visibleCount === 1 ? '1 compte' : `${visibleCount} comptes`

  return visibleCount === totalCount ? base : `${base} sur ${totalCount}`
}

// Controlled filters. The parent owns the state; this component only reports changes.
export function UserFilters({
  onReset,
  onRoleChange,
  onStatusChange,
  resultCount,
  role,
  status,
  totalCount,
}) {
  const isFiltered = role !== 'all' || status !== 'all'

  return (
    <div className="user-filters">
      <div className="user-filters__fields">
        <div className="user-filters__field">
          <label htmlFor="user-role-filter">Rôle</label>
          <select
            id="user-role-filter"
            onChange={(event) => onRoleChange(event.target.value)}
            value={role}
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="user-filters__field">
          <label htmlFor="user-status-filter">Statut</label>
          <select
            id="user-status-filter"
            onChange={(event) => onStatusChange(event.target.value)}
            value={status}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="user-filters__summary">
        <p aria-live="polite" className="user-filters__count">
          {countLabel(resultCount, totalCount)}
        </p>
        {isFiltered ? (
          <button className="user-filters__reset" onClick={onReset} type="button">
            Réinitialiser les filtres
          </button>
        ) : null}
      </div>
    </div>
  )
}
