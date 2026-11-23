import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage.jsx";
import { ForbiddenPage } from "../pages/ForbiddenPage.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
