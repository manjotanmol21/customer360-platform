import type {
  Request,
  Response,
} from "express";

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

  if (
    !Number.isInteger(customerId) ||
    customerId <= 0
  ) {
    res.status(400).json({
      success: false,
      message:
        "Customer ID must be a positive integer",
    });

    return;
  }

  const customer =
    getCustomerById(customerId);

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
    res.status(400).json({
      success: false,
      message:
        "First name, last name, email, phone and company are required",
    });

    return;
  }

  if (!isCustomerStatus(status)) {
    res.status(400).json({
      success: false,
      message:
        "Status must be Active, Pending or Inactive",
    });

    return;
  }

  const newCustomer = createCustomer({
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

export const editCustomer = (
  req: Request,
  res: Response,
): void => {
  const customerId = Number(req.params.id);

  if (
    !Number.isInteger(customerId) ||
    customerId <= 0
  ) {
    res.status(400).json({
      success: false,
      message:
        "Customer ID must be a positive integer",
    });

    return;
  }

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
    res.status(400).json({
      success: false,
      message:
        "First name, last name, email, phone and company are required",
    });

    return;
  }

  if (!isCustomerStatus(status)) {
    res.status(400).json({
      success: false,
      message:
        "Status must be Active, Pending or Inactive",
    });

    return;
  }

  const updatedCustomer = updateCustomer(
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

  if (
    !Number.isInteger(customerId) ||
    customerId <= 0
  ) {
    res.status(400).json({
      success: false,
      message:
        "Customer ID must be a positive integer",
    });

    return;
  }

  const deleted =
    deleteCustomer(customerId);

  if (!deleted) {
    res.status(404).json({
      success: false,
      message: "Customer not found",
    });

    return;
  }

  res.status(204).send();
};