import { useState } from "react";
import { BrandLogo } from "./components/common/BrandLogo.jsx";
import { AdminLayout } from "./components/layout/AdminLayout.jsx";
import { LearnerLayout } from "./components/layout/LearnerLayout.jsx";
import { UnsupportedRoleNotice } from "./components/common/UnsupportedRoleNotice.jsx";
import {
  ADMIN_NAVIGATION,
  LEARNER_NAVIGATION,
} from "./components/layout/navigation.js";
import { LoginForm } from "./components/auth/LoginForm.jsx";
import { useAuth } from "./hooks/useAuth.js";
import { useAdmin } from "./hooks/useAdmin.js";
import { useLearner } from "./hooks/useLearner.js";
import "./App.css";

function App() {
  const { session, login, logout } = useAuth();
  const [activeView, setActiveView] = useState("overview");

  function handleLogout() {
    logout();
    setActiveView("overview");
  }

  const { loadUsers, loadCourses, createUser, updateUser } = useAdmin(
    session,
    handleLogout,
  );

  const { loadEnrollments } = useLearner(session, handleLogout);

  if (!session?.user) {
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
            <LoginForm onSubmit={login} />
          </div>
        </section>
      </main>
    );
  }

  if (session.user.role === "admin") {
    const currentView = ADMIN_NAVIGATION.some((item) => item.id === activeView)
      ? activeView
      : ADMIN_NAVIGATION[0].id;

    return (
      <AdminLayout
        activeView={currentView}
        onCreateUser={createUser}
        onLoadCourses={loadCourses}
        onLoadUsers={loadUsers}
        onLogout={handleLogout}
        onNavigate={setActiveView}
        onUpdateUser={updateUser}
        user={session.user}
      />
    );
  }

  if (session.user.role === "learner") {
    const currentView = LEARNER_NAVIGATION.some(
      (item) => item.id === activeView,
    )
      ? activeView
      : LEARNER_NAVIGATION[0].id;

    return (
      <LearnerLayout
        activeView={currentView}
        onLoadEnrollments={loadEnrollments}
        onLogout={handleLogout}
        onNavigate={setActiveView}
        user={session.user}
      />
    );
  }

  return (
    <UnsupportedRoleNotice onLogout={handleLogout} role={session.user.role} />
  );
}

export default App;
