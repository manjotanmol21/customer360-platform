import { Router } from "express";
import {
  addCustomer,
  editCustomer,
  getCustomer,
  getCustomers,
  removeCustomer,
} from "../controllers/customer.controller.js";

const router = Router();

router.get("/", getCustomers);

router.get("/:id", getCustomer);

router.post("/", addCustomer);

router.put("/:id", editCustomer);

router.delete("/:id", removeCustomer);

export default router;