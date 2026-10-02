import axios from "axios";

import {
  ACCESS_TOKEN_STORAGE_KEY,
  AUTH_SESSION_EXPIRED_EVENT,
} from "../constants/auth.constants";

const configuredApiBaseUrl =
  import.meta.env
    .VITE_API_BASE_URL
    ?.trim();

const developmentApiBaseUrl =
  "http://localhost:3000/api";

const apiBaseUrl =
  configuredApiBaseUrl ||
  (
    import.meta.env.DEV
      ? developmentApiBaseUrl
      : ""
  );

if (!apiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is required in production.",
  );
}

const normalizedApiBaseUrl =
  apiBaseUrl.replace(
    /\/+$/,
    "",
  );

const apiClient = axios.create({
  baseURL:
    normalizedApiBaseUrl,

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