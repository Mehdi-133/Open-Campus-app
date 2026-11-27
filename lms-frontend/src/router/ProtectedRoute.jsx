import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SessionLoading } from "../components/common/SessionLoading.jsx";
import { useAuth } from "../hooks/useAuth.js";

// Pathless layout route: every child waits for the certified session.
export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <SessionLoading />;

  if (!isAuthenticated) {
    // Remember the requested page so login can return there after success.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
