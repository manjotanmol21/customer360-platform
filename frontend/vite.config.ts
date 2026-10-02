import {
  defineConfig,
  loadEnv,
} from "vite";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function validateProductionApiUrl(
  value: string | undefined,
): void {
  const apiBaseUrl =
    value?.trim();

  if (!apiBaseUrl) {
    throw new Error(
      "VITE_API_BASE_URL is required for a production build.",
    );
  }

  let parsedApiBaseUrl: URL;

  try {
    parsedApiBaseUrl =
      new URL(apiBaseUrl);
  } catch {
    throw new Error(
      "VITE_API_BASE_URL must be a valid absolute URL.",
    );
  }

  if (
    parsedApiBaseUrl.protocol !==
    "https:"
  ) {
    throw new Error(
      "VITE_API_BASE_URL must use HTTPS in production.",
    );
  }

  const normalizedPath =
    parsedApiBaseUrl.pathname
      .replace(
        /\/+$/,
        "",
      );

  if (
    !normalizedPath.endsWith(
      "/api",
    )
  ) {
    throw new Error(
      "VITE_API_BASE_URL must end with /api.",
    );
  }
}

export default defineConfig(
  ({ mode }) => {
    const environment =
      loadEnv(
        mode,
        process.cwd(),
        "",
      );

    if (mode === "production") {
      validateProductionApiUrl(
        environment
          .VITE_API_BASE_URL,
      );
    }

    return {
      plugins: [
        react(),
        tailwindcss(),
      ],
    };
  },
);