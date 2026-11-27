import { useOutletContext } from "react-router-dom";
import { CoursesPage } from "../components/courses/CoursesPage.jsx";
import { LearnerDashboard } from "../components/learner/LearnerDashboard.jsx";
import { LearnerProfilePage } from "../components/learner/LearnerProfilePage.jsx";
import { UsersPage } from "../components/users/UsersPage.jsx";
import { useAuth } from "../hooks/useAuth.js";

// Thin adapters: they read what the route layout provides and render the
// presentational screen. Requests stay in the hooks, navigation in the layout.
export function AdminOverviewScreen() {
  const { navigateTo } = useOutletContext();

  return (
    <section className="dashboard-grid" aria-label="Espace administrateur">
      <article className="dashboard-hero dashboard-hero--admin">
        <p className="dashboard-hero__eyebrow">OPEN CAMPUS · ADMIN</p>
        <h3>Faites grandir votre communauté d’apprentissage.</h3>
        <p>Retrouvez les espaces de gestion des utilisateurs et des cours.</p>
      </article>
      <aside className="dashboard-side-card">
        <span className="dashboard-side-card__icon" aria-hidden="true">✦</span>
        <h3>Votre espace admin</h3>
        <p>Les outils disponibles dépendent des autorisations confirmées par le serveur.</p>
      </aside>
      <section className="dashboard-section">
        <div className="dashboard-section__heading">
          <div>
            <p className="eyebrow">GESTION DE LA PLATEFORME</p>
            <h3>Vos espaces</h3>
          </div>
        </div>
        <div className="management-grid">
          <button className="management-card" onClick={() => navigateTo("users")} type="button">
            <span className="management-card__icon management-card__icon--mint" aria-hidden="true">♙</span>
            <h4>Utilisateurs</h4>
            <p>Accédez aux comptes et aux rôles de la plateforme.</p>
            <span className="management-card__arrow" aria-hidden="true">→</span>
          </button>
          <button className="management-card" onClick={() => navigateTo("courses")} type="button">
            <span className="management-card__icon management-card__icon--yellow" aria-hidden="true">▤</span>
            <h4>Cours</h4>
            <p>Accédez au catalogue de cours.</p>
            <span className="management-card__arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </section>
  );
}

export function AdminUsersScreen() {
  const { createUser, loadUsers, updateUser } = useOutletContext();

  return (
    <UsersPage
      onCreateUser={createUser}
      onLoadUsers={loadUsers}
      onUpdateUser={updateUser}
    />
  );
}

export function AdminCoursesScreen() {
  const { loadCourses } = useOutletContext();

  return <CoursesPage onLoadCourses={loadCourses} />;
}

export function LearnerDashboardScreen() {
  const { coursesError, coursesStatus, enrollments, loadCourses, navigateTo } =
    useOutletContext();
  const { user } = useAuth();

  return (
    <LearnerDashboard
      coursesError={coursesError}
      coursesStatus={coursesStatus}
      enrollments={enrollments}
      onLoadCourses={loadCourses}
      onNavigate={navigateTo}
      user={user}
    />
  );
}

export function LearnerMyCoursesScreen() {
  return (
    <>
      <div className="app-content__heading app-content__heading--section">
        <h2>Mes cours</h2>
      </div>
      <section className="information-panel" aria-live="polite">
        <span className="information-panel__icon" aria-hidden="true">i</span>
        <div>
          <h3>Vos cours confirmés apparaîtront ici</h3>
          <p>
            Cette vue présentera vos inscriptions et leur progression à partir de la
            liste chargée depuis l’accueil.
          </p>
        </div>
      </section>
    </>
  );
}

export function LearnerProfileScreen() {
  const { user } = useAuth();

  return <LearnerProfilePage user={user} />;
}
