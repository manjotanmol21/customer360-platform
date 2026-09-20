import "dotenv/config";

import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum([
      "development",
      "test",
      "production",
    ])
    .default("development"),

  PORT: z.coerce
    .number()
    .int("PORT must be an integer")
    .min(
      1,
      "PORT must be at least 1",
    )
    .max(
      65_535,
      "PORT must be no greater than 65535",
    )
    .default(3000),

  DATABASE_URL: z
    .string()
    .trim()
    .min(
      1,
      "DATABASE_URL is required",
    ),

  JWT_SECRET: z
    .string()
    .min(
      32,
      "JWT_SECRET must contain at least 32 characters",
    ),

  JWT_EXPIRES_IN: z
    .string()
    .trim()
    .min(
      1,
      "JWT_EXPIRES_IN is required",
    )
    .default("15m"),

  CORS_ORIGINS: z
    .string()
    .trim()
    .min(
      1,
      "CORS_ORIGINS must contain at least one origin",
    )
    .default(
      "http://localhost:5173",
    ),

  JSON_BODY_LIMIT: z
    .string()
    .trim()
    .min(
      1,
      "JSON_BODY_LIMIT is required",
    )
    .default("100kb"),

  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int(
      "RATE_LIMIT_WINDOW_MS must be an integer",
    )
    .positive(
      "RATE_LIMIT_WINDOW_MS must be positive",
    )
    .default(900_000),

  RATE_LIMIT_MAX: z.coerce
    .number()
    .int(
      "RATE_LIMIT_MAX must be an integer",
    )
    .positive(
      "RATE_LIMIT_MAX must be positive",
    )
    .default(100),

  AUTH_RATE_LIMIT_MAX: z.coerce
    .number()
    .int(
      "AUTH_RATE_LIMIT_MAX must be an integer",
    )
    .positive(
      "AUTH_RATE_LIMIT_MAX must be positive",
    )
    .default(10),
});

const result =
  environmentSchema.safeParse(
    process.env,
  );

if (!result.success) {
  const validationErrors =
    result.error.issues.map(
      (issue) => {
        const variable =
          issue.path.join(".") ||
          "environment";

        return `${variable}: ${issue.message}`;
      },
    );

  throw new Error(
    [
      "Invalid backend environment configuration:",
      ...validationErrors.map(
        (message) => `- ${message}`,
      ),
    ].join("\n"),
  );
}

const corsOrigins =
  result.data.CORS_ORIGINS
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

if (corsOrigins.length === 0) {
  throw new Error(
    "CORS_ORIGINS must contain at least one origin.",
  );
}

for (const origin of corsOrigins) {
  let parsedOrigin: URL;

  try {
    parsedOrigin = new URL(origin);
  } catch {
    throw new Error(
      `CORS_ORIGINS contains an invalid URL: ${origin}`,
    );
  }

  if (
    parsedOrigin.protocol !== "http:" &&
    parsedOrigin.protocol !== "https:"
  ) {
    throw new Error(
      `CORS origin must use HTTP or HTTPS: ${origin}`,
    );
  }
}

export const env = {
  nodeEnv: result.data.NODE_ENV,
  port: result.data.PORT,
  databaseUrl:
    result.data.DATABASE_URL,
  jwtSecret:
    result.data.JWT_SECRET,
  jwtExpiresIn:
    result.data.JWT_EXPIRES_IN,
  corsOrigins,
  jsonBodyLimit:
    result.data.JSON_BODY_LIMIT,
  rateLimitWindowMs:
    result.data.RATE_LIMIT_WINDOW_MS,
  rateLimitMax:
    result.data.RATE_LIMIT_MAX,
  authRateLimitMax:
    result.data.AUTH_RATE_LIMIT_MAX,
  isDevelopment:
    result.data.NODE_ENV ===
    "development",
  isTest:
    result.data.NODE_ENV === "test",
  isProduction:
    result.data.NODE_ENV ===
    "production",
} as const;