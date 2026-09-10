import { Router } from "express";

import {
  addCustomer,
  editCustomer,
  getCustomer,
  getCustomers,
  removeCustomer,
} from "../controllers/customer.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { customerBodySchema } from "../schemas/customer.schema.js";

const router = Router();

router.use(authenticate);

router.get("/", getCustomers);

router.get("/:id", getCustomer);

router.post(
  "/",
  validateBody(customerBodySchema),
  addCustomer,
);

router.put(
  "/:id",
  validateBody(customerBodySchema),
  editCustomer,
);

router.delete("/:id", removeCustomer);

export default router;