import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useLearner } from "../../hooks/useLearner.js";
import { AppShell } from "./AppShell.jsx";
import { LEARNER_NAVIGATION } from "./navigation.js";

const PATHS = {
  overview: "/dashboard",
  courses: "/learner/courses",
  profile: "/learner/profile",
};

export function LearnerLayout() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { loadEnrollments } = useLearner({ token, user }, logout);

  // Enrollment state lives in the layout so the dashboard and "Mes cours"
  // both read the same server-confirmed list while navigating between routes.
  const [coursesStatus, setCoursesStatus] = useState("idle");
  const [enrollments, setEnrollments] = useState([]);
  const [coursesError, setCoursesError] = useState("");

  const activeView =
    LEARNER_NAVIGATION.find((item) => PATHS[item.id] === location.pathname)?.id ||
    "overview";

  async function loadCourses() {
    if (coursesStatus === "loading") {
      return;
    }

    setCoursesStatus("loading");
    setCoursesError("");

    try {
      const nextEnrollments = await loadEnrollments();
      setEnrollments(Array.isArray(nextEnrollments) ? nextEnrollments : []);
      setCoursesStatus("success");
    } catch (requestError) {
      setEnrollments([]);
      setCoursesError(requestError?.message || "La demande a échoué. Réessayez.");
      setCoursesStatus(requestError?.status === 403 ? "forbidden" : "error");
    }
  }

  function navigateTo(viewId) {
    navigate(PATHS[viewId] || PATHS.overview);
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <AppShell
      activeView={activeView}
      navigation={LEARNER_NAVIGATION}
      onLogout={handleLogout}
      onNavigate={navigateTo}
      roleLabel="Apprenant"
      user={user}
    >
      <Outlet
        context={{
          coursesError,
          coursesStatus,
          enrollments,
          loadCourses,
          navigateTo,
        }}
      />
    </AppShell>
  );
}
