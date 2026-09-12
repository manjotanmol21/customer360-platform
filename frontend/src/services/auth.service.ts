import apiClient from "../api/apiClient";

export interface AuthUser {
  id: number;
  email: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    user: AuthUser;
    accessToken: string;
  };
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResult> {
  const response =
    await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials,
    );

  return response.data.data;
}