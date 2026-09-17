import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  useQueryClient,
} from "@tanstack/react-query";

import {
  ACCESS_TOKEN_STORAGE_KEY,
  AUTH_SESSION_EXPIRED_EVENT,
  AUTH_USER_STORAGE_KEY,
} from "../constants/auth.constants";

import {
  loginUser,
  type AuthUser,
  type LoginCredentials,
  type UserRole,
} from "../services/auth.service";

interface AuthContextValue {
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

interface AuthProviderProps {
  children: ReactNode;
}

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
    return JSON.parse(
      storedUser,
    ) as AuthUser;
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
  const queryClient = useQueryClient();

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

  const [
    sessionExpired,
    setSessionExpired,
  ] = useState(false);

  const clearAuthSession =
    useCallback((): void => {
      sessionStorage.removeItem(
        ACCESS_TOKEN_STORAGE_KEY,
      );

      sessionStorage.removeItem(
        AUTH_USER_STORAGE_KEY,
      );

      setAccessToken(null);
      setUser(null);

      queryClient.clear();
    }, [queryClient]);

  const login = useCallback(
    async (
      credentials: LoginCredentials,
    ): Promise<void> => {
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
      setSessionExpired(false);
    },
    [],
  );

  const logout =
    useCallback((): void => {
      clearAuthSession();
      setSessionExpired(false);
    }, [clearAuthSession]);

  useEffect(() => {
    function handleSessionExpired(): void {
      clearAuthSession();
      setSessionExpired(true);
    }

    window.addEventListener(
      AUTH_SESSION_EXPIRED_EVENT,
      handleSessionExpired,
    );

    return () => {
      window.removeEventListener(
        AUTH_SESSION_EXPIRED_EVENT,
        handleSessionExpired,
      );
    };
  }, [clearAuthSession]);

  const hasRole = useCallback(
    (...roles: UserRole[]): boolean => {
      if (!user) {
        return false;
      }

      return roles.includes(user.role);
    },
    [user],
  );

  const isAuthenticated =
    Boolean(accessToken && user);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      sessionExpired,
      hasRole,
      login,
      logout,
    }),
    [
      user,
      accessToken,
      isAuthenticated,
      sessionExpired,
      hasRole,
      login,
      logout,
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