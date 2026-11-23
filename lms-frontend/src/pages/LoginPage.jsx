import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/common/BrandLogo.jsx";
import { LoginForm } from "../components/auth/LoginForm.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(credentials) {
    const session = await login(credentials);
    const role = session.user?.role;
    if (role === "admin") navigate("/admin/users", { replace: true });
    else if (role === "trainer")
      navigate("/trainer/courses", { replace: true });
    else navigate("/dashboard", { replace: true });
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <aside className="auth-card__story">
          <BrandLogo light />
          <div className="auth-card__art" aria-hidden="true">
            <svg viewBox="0 0 64 64" focusable="false">
              <path d="m8 26 24-14 24 14-24 14-24-14Z" />
              <path d="M18 33v14c8 8 20 8 28 0V33" />
              <path d="M56 26v20" />
            </svg>
          </div>
          <div className="auth-card__story-copy">
            <h2>Votre prochain chapitre commence ici.</h2>
            <p>
              Un espace pour les esprits curieux. Apprenez quelque chose qui
              vous restera.
            </p>
          </div>
        </aside>
        <div className="auth-card__form">
          <LoginForm onSubmit={handleLogin} />
        </div>
      </section>
    </main>
  );
}
