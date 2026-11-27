// Deliberately empty screen: this checkpoint wires access control only.
// Real screens are migrated in the next checkpoint.
export function PlaceholderPage({ title }) {
  return (
    <main className="auth-page">
      <section className="information-panel" aria-live="polite">
        <h1>{title}</h1>
        <p>Le contenu de cet écran sera ajouté à l’étape suivante du Brief 2.</p>
      </section>
    </main>
  );
}
