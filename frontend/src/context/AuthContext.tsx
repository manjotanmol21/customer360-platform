import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  loginUser,
  type AuthUser,
  type LoginCredentials,
} from "../services/auth.service";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (
    credentials: LoginCredentials,
  ) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const ACCESS_TOKEN_STORAGE_KEY =
  "customer360_access_token";

const AUTH_USER_STORAGE_KEY =
  "customer360_auth_user";

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

function getStoredUser(): AuthUser | null {
  const storedUser =
    sessionStorage.getItem(
      AUTH_USER_STORAGE_KEY,
    );

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    sessionStorage.removeItem(
      AUTH_USER_STORAGE_KEY,
    );

    return null;
  }
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [accessToken, setAccessToken] =
    useState<string | null>(() => {
      return sessionStorage.getItem(
        ACCESS_TOKEN_STORAGE_KEY,
      );
    });

  const [user, setUser] =
    useState<AuthUser | null>(() => {
      return getStoredUser();
    });

  async function login(
    credentials: LoginCredentials,
  ): Promise<void> {
    const result =
      await loginUser(credentials);

    sessionStorage.setItem(
      ACCESS_TOKEN_STORAGE_KEY,
      result.accessToken,
    );

    sessionStorage.setItem(
      AUTH_USER_STORAGE_KEY,
      JSON.stringify(result.user),
    );

    setAccessToken(result.accessToken);
    setUser(result.user);
  }

  function logout(): void {
    sessionStorage.removeItem(
      ACCESS_TOKEN_STORAGE_KEY,
    );

    sessionStorage.removeItem(
      AUTH_USER_STORAGE_KEY,
    );

    setAccessToken(null);
    setUser(null);
  }

  const isAuthenticated =
    Boolean(accessToken);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      login,
      logout,
    }),
    [
      user,
      accessToken,
      isAuthenticated,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used inside an AuthProvider.",
    );
  }

  return context;
}