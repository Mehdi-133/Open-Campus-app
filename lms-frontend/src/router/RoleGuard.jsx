import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

// Pathless layout route nested under ProtectedRoute. An unknown or missing
// role is denied, so the guard fails closed without relying on the UI.
export function RoleGuard({ allowedRoles = [] }) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
