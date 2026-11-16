import { useState } from 'react'
import { UserDetailsPanel } from './UserDetailsPanel.jsx'
import { UserFilters } from './UserFilters.jsx'
import { UserList } from './UserList.jsx'

const IDLE = 'idle'
const LOADING = 'loading'
const SUCCESS = 'success'
const ERROR = 'error'

export function UsersLoading() {
  return (
    <div className="users-page__state" role="status">
      <span className="users-page__spinner" aria-hidden="true" />
      <div>
        <h3>Chargement de la liste…</h3>
        <p>La liste des utilisateurs est demandée au serveur.</p>
      </div>
    </div>
  )
}

export function UsersEmpty() {
  return (
    <div className="users-page__state">
      <h3>Aucun utilisateur à afficher</h3>
      <p>Le serveur n’a renvoyé aucun compte pour cette liste.</p>
    </div>
  )
}

export function UsersError({ message, onRetry }) {
  return (
    <div className="users-page__state users-page__state--error" role="alert">
      <div>
        <h3>Le chargement a échoué</h3>
        <p>{message}</p>
      </div>
      <button className="users-page__retry" onClick={onRetry} type="button">Réessayer</button>
    </div>
  )
}

export function UsersPage({ onLoadUsers }) {
  // Server request state.
  const [status, setStatus] = useState(IDLE)
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  // Local UI state: filters and the selected row.
  // They live here because both the list and the detail panel need them (lifting state).
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUserId, setSelectedUserId] = useState(null)

  async function loadUsers() {
    if (status === LOADING) {
      return
    }

    setStatus(LOADING)
    setError('')
    setSelectedUserId(null)

    try {
      const nextUsers = await onLoadUsers()
      setUsers(Array.isArray(nextUsers) ? nextUsers : [])
      setStatus(SUCCESS)
    } catch (requestError) {
      setUsers([])
      setError(requestError?.message || 'La demande a échoué. Réessayez.')
      setStatus(ERROR)
    }
  }

  // The filtered list is derived during render, never stored in state.
  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter

    return matchesRole && matchesStatus
  })

  const selectedUser = users.find((user) => user.id === selectedUserId) || null
  const hasUsers = status === SUCCESS && users.length > 0

  function handleRoleChange(value) {
    setRoleFilter(value)
    setSelectedUserId(null)
  }

  function handleStatusChange(value) {
    setStatusFilter(value)
    setSelectedUserId(null)
  }

  function handleResetFilters() {
    setRoleFilter('all')
    setStatusFilter('all')
    setSelectedUserId(null)
  }

  // Clicking the same row again closes its detail panel.
  function handleSelectUser(userId) {
    setSelectedUserId((currentId) => (currentId === userId ? null : userId))
  }

  return (
    <section className="users-page" aria-label="Gestion des utilisateurs">
      <div className="users-page__toolbar">
        <div className="users-page__intro">
          <p className="eyebrow">COMPTES DE LA PLATEFORME</p>
          <p className="users-page__description">
            Consultez le nom, l’adresse e-mail, le rôle et le statut des comptes. La liste n’est demandée
            au serveur qu’à partir du bouton ci-dessous.
          </p>
        </div>
        <button
          className="users-page__load"
          disabled={status === LOADING}
          onClick={loadUsers}
          type="button"
        >
          {status === LOADING ? 'Chargement…' : hasUsers ? 'Recharger la liste' : 'Charger les utilisateurs'}
        </button>
      </div>

      <div aria-busy={status === LOADING} aria-live="polite" className="users-page__result">
        {status === IDLE ? (
          <p className="users-page__hint">
            Aucun chargement n’a encore été demandé. Utilisez « Charger les utilisateurs » pour afficher la liste.
          </p>
        ) : null}

        {status === LOADING ? <UsersLoading /> : null}

        {status === ERROR ? <UsersError message={error} onRetry={loadUsers} /> : null}

        {status === SUCCESS && users.length === 0 ? <UsersEmpty /> : null}

        {hasUsers ? (
          <>
            <UserFilters
              onReset={handleResetFilters}
              onRoleChange={handleRoleChange}
              onStatusChange={handleStatusChange}
              resultCount={filteredUsers.length}
              role={roleFilter}
              status={statusFilter}
              totalCount={users.length}
            />

            {filteredUsers.length > 0 ? (
              <div className="users-page__content">
                <UserList
                  onSelectUser={handleSelectUser}
                  selectedId={selectedUserId}
                  users={filteredUsers}
                />
                <UserDetailsPanel onClose={() => setSelectedUserId(null)} user={selectedUser} />
              </div>
            ) : (
              <div className="users-page__state">
                <div>
                  <h3>Aucun compte ne correspond aux filtres</h3>
                  <p>Modifiez le rôle ou le statut, ou réinitialisez les filtres.</p>
                </div>
                <button className="users-page__retry" onClick={handleResetFilters} type="button">
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  )
}
