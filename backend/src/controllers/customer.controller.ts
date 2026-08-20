import type { Request, Response } from "express";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  type CreateCustomerInput,
  type UpdateCustomerInput,
} from "../services/customer.service.js";

export const getCustomers = (
  req: Request,
  res: Response,
): void => {
  const customers = getAllCustomers();

  res.status(200).json({
    success: true,
    data: customers,
  });
};

export const getCustomer = (
  req: Request,
  res: Response,
): void => {
  const customerId = Number(req.params.id);

  if (Number.isNaN(customerId)) {
    res.status(400).json({
      success: false,
      message: "Customer ID must be a valid number",
    });

    return;
  }

  const customer = getCustomerById(customerId);

  if (!customer) {
    res.status(404).json({
      success: false,
      message: "Customer not found",
    });

    return;
  }

  res.status(200).json({
    success: true,
    data: customer,
  });
};

export const addCustomer = (
  req: Request,
  res: Response,
): void => {
  const { name, email, company } =
    req.body as Partial<CreateCustomerInput>;

  if (!name || !email || !company) {
    res.status(400).json({
      success: false,
      message: "Name, email and company are required",
    });

    return;
  }

  const newCustomer = createCustomer({
    name,
    email,
    company,
  });

  res.status(201).json({
    success: true,
    data: newCustomer,
  });
};

export const editCustomer = (
  req: Request,
  res: Response,
): void => {
  const customerId = Number(req.params.id);

  if (Number.isNaN(customerId)) {
    res.status(400).json({
      success: false,
      message: "Customer ID must be a valid number",
    });

    return;
  }

  const { name, email, company } =
    req.body as Partial<UpdateCustomerInput>;

  if (!name || !email || !company) {
    res.status(400).json({
      success: false,
      message: "Name, email and company are required",
    });

    return;
  }

  const updatedCustomer = updateCustomer(customerId, {
    name,
    email,
    company,
  });

  if (!updatedCustomer) {
    res.status(404).json({
      success: false,
      message: "Customer not found",
    });

    return;
  }

  res.status(200).json({
    success: true,
    data: updatedCustomer,
  });
};

export const removeCustomer = (
  req: Request,
  res: Response,
): void => {
  const customerId = Number(req.params.id);

  if (Number.isNaN(customerId)) {
    res.status(400).json({
      success: false,
      message: "Customer ID must be a valid number",
    });

    return;
  }

  const deleted = deleteCustomer(customerId);

  if (!deleted) {
    res.status(404).json({
      success: false,
      message: "Customer not found",
    });

    return;
  }

  res.status(204).send();
};