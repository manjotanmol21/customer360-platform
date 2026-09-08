import { Router } from "express";

import { register } from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { registerUserSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerUserSchema),
  register,
);

export default router;