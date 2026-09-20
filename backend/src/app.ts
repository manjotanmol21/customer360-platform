import express, {
  type Request,
  type Response,
} from "express";

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

import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";

const app = express();

app.disable("x-powered-by");

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

app.get(
  "/api/health",
  (
    req: Request,
    res: Response,
  ) => {
    res.status(200).json({
      status: "ok",
      message:
        "Customer360 API is running",
    });
  },
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