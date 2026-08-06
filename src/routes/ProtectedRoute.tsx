import type { ReactNode } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const location = useLocation();

  const isAuthenticated =
    sessionStorage.getItem(
      "customer360_authenticated",
    ) === "true";

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}