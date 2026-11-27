import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout.jsx";
import { LearnerLayout } from "../components/layout/LearnerLayout.jsx";
import { ForbiddenPage } from "../pages/ForbiddenPage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";
import { PlaceholderPage } from "../pages/PlaceholderPage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { RoleGuard } from "./RoleGuard.jsx";
import {
  AdminCoursesScreen,
  AdminOverviewScreen,
  AdminUsersScreen,
  LearnerDashboardScreen,
  LearnerMyCoursesScreen,
  LearnerProfileScreen,
} from "./screens.jsx";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<ForbiddenPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowedRoles={["learner"]} />}>
          <Route element={<LearnerLayout />}>
            <Route path="/dashboard" element={<LearnerDashboardScreen />} />
            <Route path="/learner/courses" element={<LearnerMyCoursesScreen />} />
            <Route path="/learner/profile" element={<LearnerProfileScreen />} />
          </Route>
        </Route>

        <Route element={<RoleGuard allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminOverviewScreen />} />
            <Route path="/admin/users" element={<AdminUsersScreen />} />
            <Route path="/admin/courses" element={<AdminCoursesScreen />} />
          </Route>
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
