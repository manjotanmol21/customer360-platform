import { Router } from "express";

import {
  login,
  register,
} from "../controllers/auth.controller.js";

import {
  authRateLimiter,
} from "../middleware/rate-limit.middleware.js";

import {
  validateBody,
} from "../middleware/validate.middleware.js";

import {
  loginUserSchema,
  registerUserSchema,
} from "../schemas/auth.schema.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerUserSchema),
  register,
);

router.post(
  "/login",
  authRateLimiter,
  validateBody(loginUserSchema),
  login,
);

export default router;