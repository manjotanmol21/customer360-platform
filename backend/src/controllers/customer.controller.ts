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

export const getCustomers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const customers = await getAllCustomers();

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error(
      "Failed to retrieve customers:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Unable to retrieve customers",
    });
  }
};

export const getCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

  try {
    const customer =
      await getCustomerById(customerId);

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
  } catch (error) {
    console.error(
      `Failed to retrieve customer ${customerId}:`,
      error,
    );

    res.status(500).json({
      success: false,
      message: "Unable to retrieve customer",
    });
  }
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

  try {
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
  } catch (error) {
    console.error(
      "Failed to create customer:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Unable to create customer",
    });
  }
};

export const editCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

  try {
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
  } catch (error) {
    console.error(
      `Failed to update customer ${customerId}:`,
      error,
    );

    res.status(500).json({
      success: false,
      message: "Unable to update customer",
    });
  }
};

export const removeCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

  try {
    const deleted =
      await deleteCustomer(customerId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Customer not found",
      });

      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(
      `Failed to delete customer ${customerId}:`,
      error,
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete customer",
    });
  }
};