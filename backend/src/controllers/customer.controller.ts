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
  isCustomerStatus,
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
  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    status,
  } = req.body as Partial<CreateCustomerInput>;

  if (
    !firstName?.trim() ||
    !lastName?.trim() ||
    !email?.trim() ||
    !phone?.trim() ||
    !company?.trim()
  ) {
    throw new BadRequestError(
      "First name, last name, email, phone and company are required",
    );
  }

  if (!isCustomerStatus(status)) {
    throw new BadRequestError(
      "Status must be Active, Pending or Inactive",
    );
  }

  const newCustomer =
    await createCustomer({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      status,
    });

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

  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    status,
  } = req.body as Partial<UpdateCustomerInput>;

  if (
    !firstName?.trim() ||
    !lastName?.trim() ||
    !email?.trim() ||
    !phone?.trim() ||
    !company?.trim()
  ) {
    throw new BadRequestError(
      "First name, last name, email, phone and company are required",
    );
  }

  if (!isCustomerStatus(status)) {
    throw new BadRequestError(
      "Status must be Active, Pending or Inactive",
    );
  }

  const updatedCustomer =
    await updateCustomer(
      customerId,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim(),
        status,
      },
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