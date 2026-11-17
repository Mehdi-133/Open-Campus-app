import { useState } from 'react'
import { ApiError } from '../api/client.js'
import { UserDetailsPanel } from './UserDetailsPanel.jsx'
import { UserFilters } from './UserFilters.jsx'
import { UserForm } from './UserForm.jsx'
import { UserList } from './UserList.jsx'

const IDLE = 'idle'
const LOADING = 'loading'
const SUCCESS = 'success'
const ERROR = 'error'
const FORBIDDEN = 'forbidden'

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

export function UsersForbidden() {
  return (
    <div className="users-page__state users-page__state--error" role="alert">
      <div>
        <h3>Accès refusé</h3>
        <p>Le serveur a refusé cette demande. Votre session reste active.</p>
      </div>
    </div>
  )
}

export function UsersPage({ onCreateUser, onLoadUsers, onUpdateUser }) {
  // Server request state.
  const [status, setStatus] = useState(IDLE)
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  // Local UI state: filters and the selected row.
  // They live here because both the list and the detail panel need them (lifting state).
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [notice, setNotice] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState('')

  async function loadUsers() {
    if (status === LOADING) {
      return
    }

    setStatus(LOADING)
    setError('')
    setSelectedUserId(null)
    setNotice(null)
    setRefreshError('')

    try {
      const nextUsers = await onLoadUsers()
      setUsers(Array.isArray(nextUsers) ? nextUsers : [])
      setStatus(SUCCESS)
    } catch (requestError) {
      setUsers([])
      setError(requestError?.message || 'La demande a échoué. Réessayez.')
      setStatus(requestError?.status === 403 ? FORBIDDEN : ERROR)
    }
  }

  // A confirmed update is already in the list. This follow-up request only
  // replaces it with the server's authoritative list; if it fails, the
  // confirmed row is kept and a non-blocking warning is shown instead.
  async function refreshUsers() {
    setIsRefreshing(true)
    setRefreshError('')

    try {
      const nextUsers = await onLoadUsers()

      if (Array.isArray(nextUsers)) {
        setUsers(nextUsers)
      } else {
        setRefreshError('La liste renvoyée par le serveur est invalide.')
      }
    } catch (requestError) {
      // A 401 is handled by App, which purges the session and unmounts this view.
      if (requestError?.status !== 401) {
        setRefreshError(requestError?.message || 'La liste n’a pas pu être actualisée.')
      }
    } finally {
      setIsRefreshing(false)
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

  function handleToggleCreateForm() {
    setEditingUser(null)
    setIsFormOpen((open) => !open)
  }

  function handleEditUser(user) {
    setIsFormOpen(false)
    setRefreshError('')
    setEditingUser(user)
  }

  // Cancelling discards the form state by unmounting it: the next edit remounts
  // a fresh form from the server-provided row (via the key below).
  function handleCancelEdit() {
    setEditingUser(null)
  }

  // The list is updated immutably only after the callback resolves with a real
  // server payload. No success state exists on a rejection or on a malformed response.
  async function handleCreateUser(values) {
    const createdUser = await onCreateUser(values)

    if (!createdUser || typeof createdUser.id !== 'string') {
      throw new ApiError('Le compte créé renvoyé par le serveur est invalide.')
    }

    setUsers((currentUsers) => {
      const alreadyListed = currentUsers.some((user) => user.id === createdUser.id)

      return alreadyListed
        ? currentUsers.map((user) => (user.id === createdUser.id ? createdUser : user))
        : [...currentUsers, createdUser]
    })
    setNotice({ kind: 'created', name: createdUser.name || createdUser.email || 'Nouveau compte' })
    setIsFormOpen(false)

    return createdUser
  }

  async function handleUpdateUser(values) {
    if (!editingUser?.id) {
      throw new ApiError('Aucun compte n’a été sélectionné pour la modification.')
    }

    const updatedUser = await onUpdateUser(editingUser.id, values)

    if (!updatedUser || typeof updatedUser.id !== 'string') {
      throw new ApiError('Le compte modifié renvoyé par le serveur est invalide.')
    }

    setUsers((currentUsers) => currentUsers.map(
      (user) => (user.id === updatedUser.id ? updatedUser : user),
    ))
    setEditingUser(null)
    setNotice({ kind: 'updated', name: updatedUser.name || updatedUser.email || 'Compte' })

    await refreshUsers()

    return updatedUser
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
        <div className="users-page__actions">
          <button
            aria-controls="admin-user-form"
            aria-expanded={isFormOpen}
            className="users-page__secondary"
            onClick={handleToggleCreateForm}
            type="button"
          >
            {isFormOpen ? 'Masquer le formulaire' : 'Nouvel utilisateur'}
          </button>
          <button
            className="users-page__load"
            disabled={status === LOADING}
            onClick={loadUsers}
            type="button"
          >
            {status === LOADING ? 'Chargement…' : hasUsers ? 'Recharger la liste' : 'Charger les utilisateurs'}
          </button>
        </div>
      </div>

      {isFormOpen ? (
        <section className="user-form-card" id="admin-user-form" aria-labelledby="user-form-title">
          <div className="user-form-card__intro">
            <p className="eyebrow">CRÉATION D’UN COMPTE</p>
            <h3 id="user-form-title">Nouvel utilisateur</h3>
            <p className="user-form-card__notice">
              Le compte est créé seulement après réponse du serveur. En cas de refus, votre saisie
              est conservée et le champ concerné est signalé.
            </p>
          </div>
          <UserForm onCancel={() => setIsFormOpen(false)} onSubmit={handleCreateUser} />
        </section>
      ) : null}

      {editingUser ? (
        <section className="user-form-card user-form-card--edit" aria-labelledby="user-edit-form-title">
          <div className="user-form-card__intro">
            <p className="eyebrow">MODIFICATION D’UN COMPTE</p>
            <h3 id="user-edit-form-title">Modifier {editingUser.name || editingUser.email}</h3>
            <p className="user-form-card__notice">
              Les champs sont préremplis avec les données renvoyées par le serveur. Annulez pour les
              ignorer, ou réinitialisez pour revenir à ces valeurs.
            </p>
          </div>
          <UserForm
            initialValues={editingUser}
            key={editingUser.id}
            mode="edit"
            onCancel={handleCancelEdit}
            onSubmit={handleUpdateUser}
          />
        </section>
      ) : null}

      {notice ? (
        <div className="users-page__created" role="status">
          <div>
            <h3>{notice.kind === 'updated' ? 'Compte modifié' : 'Compte créé'}</h3>
            <p>
              {notice.name} a été {notice.kind === 'updated' ? 'mis à jour' : 'ajouté'} à la liste
              après confirmation du serveur.
            </p>
            {isRefreshing ? <p className="users-page__notice-detail">Actualisation de la liste…</p> : null}
            {refreshError ? <p className="users-page__notice-error">{refreshError}</p> : null}
          </div>
          <button
            className="users-page__secondary"
            onClick={() => { setNotice(null); setRefreshError('') }}
            type="button"
          >
            Masquer
          </button>
        </div>
      ) : null}

      <div aria-busy={status === LOADING || isRefreshing} aria-live="polite" className="users-page__result">
        {status === IDLE ? (
          <p className="users-page__hint">
            Aucun chargement n’a encore été demandé. Utilisez « Charger les utilisateurs » pour afficher la liste.
          </p>
        ) : null}

        {status === LOADING ? <UsersLoading /> : null}

        {status === ERROR ? <UsersError message={error} onRetry={loadUsers} /> : null}

        {status === FORBIDDEN ? <UsersForbidden /> : null}

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
                <UserDetailsPanel
                  onClose={() => setSelectedUserId(null)}
                  onEdit={handleEditUser}
                  user={selectedUser}
                />
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
