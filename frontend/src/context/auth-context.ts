import { createContext } from "react";

import type {
  AuthUser,
  LoginCredentials,
  UserRole,
} from "../services/auth.service";

export interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  sessionExpired: boolean;

  hasRole: (
    ...roles: UserRole[]
  ) => boolean;

  login: (
    credentials: LoginCredentials,
  ) => Promise<void>;

  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );