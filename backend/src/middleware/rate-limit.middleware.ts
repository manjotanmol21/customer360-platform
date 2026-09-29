import {
  rateLimit,
} from "express-rate-limit";

import {
  env,
} from "../config/env.js";

export const apiRateLimiter =
  rateLimit({
    windowMs:
      env.rateLimitWindowMs,

    limit:
      env.rateLimitMax,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    skip: (req) => {
      return (
        req.path === "/health" ||
        req.path.startsWith(
          "/health/",
        )
      );
    },

    message: {
      success: false,
      message:
        "Too many requests. Please try again later.",
    },
  });

export const authRateLimiter =
  rateLimit({
    windowMs:
      env.rateLimitWindowMs,

    limit:
      env.authRateLimitMax,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    skipSuccessfulRequests: true,

    message: {
      success: false,
      message:
        "Too many sign-in attempts. Please try again later.",
    },
  });