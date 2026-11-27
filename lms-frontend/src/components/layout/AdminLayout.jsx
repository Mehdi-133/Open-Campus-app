import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../../hooks/useAdmin.js";
import { useAuth } from "../../hooks/useAuth.js";
import { AppShell } from "./AppShell.jsx";
import { ADMIN_NAVIGATION } from "./navigation.js";

const PATHS = {
  overview: "/admin",
  users: "/admin/users",
  courses: "/admin/courses",
};

export function AdminLayout() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const admin = useAdmin({ token, user }, logout);

  const activeView =
    ADMIN_NAVIGATION.find((item) => PATHS[item.id] === location.pathname)?.id ||
    "overview";

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
      navigation={ADMIN_NAVIGATION}
      onLogout={handleLogout}
      onNavigate={navigateTo}
      roleLabel="Admin"
      user={user}
    >
      <Outlet context={{ ...admin, navigateTo }} />
    </AppShell>
  );
}
