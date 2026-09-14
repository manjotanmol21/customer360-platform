import { Router } from "express";

import {
  addCustomer,
  editCustomer,
  getCustomer,
  getCustomers,
  removeCustomer,
} from "../controllers/customer.controller.js";

import { UserRole } from "../generated/prisma/enums.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";

import { customerBodySchema } from "../schemas/customer.schema.js";

const router = Router();

router.use(authenticate);

router.get("/", getCustomers);

router.get("/:id", getCustomer);

router.post(
  "/",
  authorize(UserRole.ADMIN),
  validateBody(customerBodySchema),
  addCustomer,
);

router.put(
  "/:id",
  authorize(UserRole.ADMIN),
  validateBody(customerBodySchema),
  editCustomer,
);

router.delete(
  "/:id",
  authorize(UserRole.ADMIN),
  removeCustomer,
);

export default router;