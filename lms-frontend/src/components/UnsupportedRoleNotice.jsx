export function UnsupportedRoleNotice({ onLogout, role }) {
  const isTrainer = role === 'trainer'

  return (
    <main className="session-placeholder" aria-labelledby="unsupported-role-title">
      <span className="brand-mark" aria-hidden="true">OC</span>
      <p className="eyebrow">ESPACE INDISPONIBLE</p>
      <h1 id="unsupported-role-title">
        {isTrainer ? 'Espace formateur non disponible' : 'Ce rôle n’est pas pris en charge'}
      </h1>
      <p>
        {isTrainer
          ? 'Les outils formateur ne sont pas inclus dans cette version. Aucun écran ni privilège administrateur n’est accordé à un compte formateur.'
          : 'Cette application ne propose pas d’espace pour ce rôle.'}
      </p>
      <button className="logout-button" onClick={onLogout} type="button">Se déconnecter</button>
    </main>
  )
}
