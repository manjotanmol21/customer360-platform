import axios from "axios";

const ACCESS_TOKEN_STORAGE_KEY =
  "customer360_access_token";

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

export default apiClient;