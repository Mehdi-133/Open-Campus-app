import { useLocation, useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/common/BrandLogo.jsx";
import { LoginForm } from "../components/auth/LoginForm.jsx";
import { useAuth } from "../hooks/useAuth.js";

const HOME_BY_ROLE = {
  admin: "/admin/users",
  trainer: "/trainer/courses",
  learner: "/dashboard",
};

const ROLE_PREFIX = {
  admin: "/admin",
  trainer: "/trainer",
  learner: "/learner",
};

// A "from" left by an earlier session must not send the new user into a route
// that their role cannot open. Guards remain the authority on the server side.
function canReturnTo(role, pathname) {
  if (typeof pathname !== "string") {
    return false;
  }

  if (pathname === "/dashboard") {
    return role === "learner";
  }

  const prefix = ROLE_PREFIX[role];

  return Boolean(prefix) && pathname.startsWith(prefix);
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogin(credentials) {
    const session = await login(credentials);
    const role = session.user?.role;
    const from = location.state?.from;
    const destination = canReturnTo(role, from?.pathname)
      ? `${from.pathname}${from.search || ""}${from.hash || ""}`
      : HOME_BY_ROLE[role] || HOME_BY_ROLE.learner;

    navigate(destination, { replace: true, state: null });
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
