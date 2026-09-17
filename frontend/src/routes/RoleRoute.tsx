import type { ReactNode } from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import type {
  UserRole,
} from "../services/auth.service";

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleRoute({
  children,
  allowedRoles,
}: RoleRouteProps) {
  const location = useLocation();

  const {
    isAuthenticated,
    hasRole,
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (!hasRole(...allowedRoles)) {
    return (
      <Navigate
        to="/forbidden"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}