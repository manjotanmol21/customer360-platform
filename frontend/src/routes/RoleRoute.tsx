import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import type {
  UserRole,
} from "../services/auth.service";

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleRoute({
  children,
  allowedRoles,
}: RoleRouteProps) {
  const { hasRole } = useAuth();
  const location = useLocation();

  const isAllowed =
    hasRole(...allowedRoles);

  if (!isAllowed) {
    return (
      <Navigate
        to="/customers"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }

  return children;
}