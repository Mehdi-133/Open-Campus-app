export function ForbiddenPage() {
  return (
    <main className="auth-page">
      <section className="information-panel" aria-live="polite">
        <h1>403 — Accès refusé</h1>
        <p>Vous n’avez pas les droits pour accéder à cette page.</p>
      </section>
    </main>
  )
}