import { Navigate, Route, Routes } from "react-router-dom";
import { ForbiddenPage } from "../pages/ForbiddenPage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";
import { PlaceholderPage } from "../pages/PlaceholderPage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { RoleGuard } from "./RoleGuard.jsx";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<ForbiddenPage />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<PlaceholderPage title="Espace apprenant" />}
        />

        <Route element={<RoleGuard allowedRoles={["admin"]} />}>
          <Route
            path="/admin/users"
            element={<PlaceholderPage title="Administration — Utilisateurs" />}
          />
        </Route>

        <Route element={<RoleGuard allowedRoles={["trainer"]} />}>
          <Route
            path="/trainer/courses"
            element={<PlaceholderPage title="Espace formateur — Mes cours" />}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
