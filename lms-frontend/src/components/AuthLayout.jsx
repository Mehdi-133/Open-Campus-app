import BrandLogo from './BrandLogo'

export default function AuthLayout({ children }) {
  return <main className="auth-page"><div className="auth-card">
    <section className="auth-story" aria-label="Open Campus">
      <BrandLogo />
      <div className="story-copy"><span className="eyebrow">VOTRE ESPACE POUR APPRENDRE</span><h2>Un nouveau chapitre commence ici.</h2><p>Retrouvez vos cours et avancez à votre rythme, dans un espace qui vous ressemble.</p>
      <div className="learning-art" aria-hidden="true"><div className="art-card art-card--back">Aa<span>Explorer de nouvelles idées</span></div><div className="art-card art-card--front"><span className="art-icon">✦</span>Apprendre.<br />Pratiquer.<br />Progresser.<div className="art-track"><span /></div></div></div></div>
      <p className="story-footer">Chaque parcours commence par un premier pas.</p>
    </section>
    <section className="auth-content">{children}</section>
  </div></main>
}
