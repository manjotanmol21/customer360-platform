import axios from "axios";

import {
  ACCESS_TOKEN_STORAGE_KEY,
  AUTH_SESSION_EXPIRED_EVENT,
} from "../constants/auth.constants";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:3000/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 10_000,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken =
      sessionStorage.getItem(
        ACCESS_TOKEN_STORAGE_KEY,
      );

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
);

apiClient.interceptors.response.use(
  (response) => response,

  (error: unknown) => {
    const hasStoredAccessToken =
      Boolean(
        sessionStorage.getItem(
          ACCESS_TOKEN_STORAGE_KEY,
        ),
      );

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      hasStoredAccessToken
    ) {
      window.dispatchEvent(
        new Event(
          AUTH_SESSION_EXPIRED_EVENT,
        ),
      );
    }

    return Promise.reject(error);
  },
);

export default apiClient;