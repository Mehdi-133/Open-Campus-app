import { useState } from 'react'
import { UserList } from './UserList.jsx'

const IDLE = 'idle'
const LOADING = 'loading'
const SUCCESS = 'success'
const ERROR = 'error'

function countLabel(count) {
  return count === 1 ? '1 compte' : `${count} comptes`
}

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
  const [status, setStatus] = useState(IDLE)
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  async function loadUsers() {
    if (status === LOADING) {
      return
    }

    setStatus(LOADING)
    setError('')

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

  const hasUsers = status === SUCCESS && users.length > 0

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
            <p className="users-page__count">{countLabel(users.length)}</p>
            <UserList users={users} />
          </>
        ) : null}
      </div>
    </section>
  )
}
