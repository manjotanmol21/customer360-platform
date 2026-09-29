import express from "express";

import helmet from "helmet";

import {
  env,
} from "./config/env.js";

import {
  corsMiddleware,
} from "./middleware/cors.middleware.js";

import {
  errorHandler,
} from "./middleware/error.middleware.js";

import {
  notFoundHandler,
} from "./middleware/not-found.middleware.js";

import {
  apiRateLimiter,
} from "./middleware/rate-limit.middleware.js";

import {
  requestObservabilityMiddleware,
} from "./middleware/request-observability.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(
  requestObservabilityMiddleware,
);

app.use(
  helmet({
    strictTransportSecurity:
      env.isProduction
        ? undefined
        : false,
  }),
);

app.use(corsMiddleware);

app.use(
  "/api",
  apiRateLimiter,
);

app.use(
  express.json({
    limit: env.jsonBodyLimit,
  }),
);

app.use(
  "/api/health",
  healthRoutes,
);

app.use(
  "/api/auth",
  authRoutes,
);

app.use(
  "/api/customers",
  customerRoutes,
);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;