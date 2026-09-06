import type {
  Request,
  Response,
} from "express";

import {
  BadRequestError,
  NotFoundError,
} from "../errors/app.error.js";

import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  type CreateCustomerInput,
  type UpdateCustomerInput,
} from "../services/customer.service.js";

const parseCustomerId = (
  id: string | string[] | undefined,
): number => {
  if (Array.isArray(id)) {
    throw new BadRequestError(
      "Customer ID must be a positive integer",
    );
  }

  const customerId = Number(id);

  if (
    !Number.isInteger(customerId) ||
    customerId <= 0
  ) {
    throw new BadRequestError(
      "Customer ID must be a positive integer",
    );
  }

  return customerId;
};

export const getCustomers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const customers = await getAllCustomers();

  res.status(200).json({
    success: true,
    data: customers,
  });
};

export const getCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const customerId = parseCustomerId(
    req.params.id,
  );

  const customer =
    await getCustomerById(customerId);

  if (!customer) {
    throw new NotFoundError(
      "Customer not found",
    );
  }

  res.status(200).json({
    success: true,
    data: customer,
  });
};

export const addCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const input =
    req.body as CreateCustomerInput;

  const newCustomer =
    await createCustomer(input);

  res.status(201).json({
    success: true,
    data: newCustomer,
  });
};

export const editCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const customerId = parseCustomerId(
    req.params.id,
  );

  const input =
    req.body as UpdateCustomerInput;

  const updatedCustomer =
    await updateCustomer(
      customerId,
      input,
    );

  if (!updatedCustomer) {
    throw new NotFoundError(
      "Customer not found",
    );
  }

  res.status(200).json({
    success: true,
    data: updatedCustomer,
  });
};

export const removeCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const customerId = parseCustomerId(
    req.params.id,
  );

  const deleted =
    await deleteCustomer(customerId);

  if (!deleted) {
    throw new NotFoundError(
      "Customer not found",
    );
  }

  res.status(204).send();
};