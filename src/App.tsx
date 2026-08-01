import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import CustomersPage from "./pages/customer/CustomersPage";
import SettingsPage from "./pages/settings/SettingsPage";

export default function App() {
  return (
    <Routes>
      {/* Public login page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Opening the application sends the user to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Dashboard application pages */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Unknown URLs */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}