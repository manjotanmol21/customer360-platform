import { prisma } from "../lib/prisma.js";
import { CustomerStatus as PrismaCustomerStatus } from "../generated/prisma/enums.js";

import type {
  CreateCustomerInput,
  Customer,
  CustomerStatus,
  UpdateCustomerInput,
} from "../services/customer.service.js";

const toPrismaStatus = (
  status: CustomerStatus,
): PrismaCustomerStatus => {
  switch (status) {
    case "Active":
      return PrismaCustomerStatus.ACTIVE;

    case "Inactive":
      return PrismaCustomerStatus.INACTIVE;

    case "Pending":
      return PrismaCustomerStatus.PENDING;
  }
};

const fromPrismaStatus = (
  status: PrismaCustomerStatus,
): CustomerStatus => {
  switch (status) {
    case PrismaCustomerStatus.ACTIVE:
      return "Active";

    case PrismaCustomerStatus.INACTIVE:
      return "Inactive";

    case PrismaCustomerStatus.PENDING:
      return "Pending";
  }
};

const mapCustomer = (
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    status: PrismaCustomerStatus;
    createdAt: Date;
  },
): Customer => {
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    company: customer.company,
    status: fromPrismaStatus(customer.status),
    createdAt: customer.createdAt
      .toISOString()
      .slice(0, 10),
  };
};

export const findAllCustomers = async (): Promise<Customer[]> => {
  const customers = await prisma.customer.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return customers.map(mapCustomer);
};

export const findCustomerById = async (
  id: number,
): Promise<Customer | undefined> => {
  const customer = await prisma.customer.findUnique({
    where: {
      id,
    },
  });

  if (!customer) {
    return undefined;
  }

  return mapCustomer(customer);
};

export const insertCustomer = async (
  input: CreateCustomerInput,
): Promise<Customer> => {
  const customer = await prisma.customer.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      company: input.company,
      status: toPrismaStatus(input.status),
    },
  });

  return mapCustomer(customer);
};

export const modifyCustomer = async (
  id: number,
  input: UpdateCustomerInput,
): Promise<Customer | undefined> => {
  const existingCustomer =
    await prisma.customer.findUnique({
      where: {
        id,
      },
    });

  if (!existingCustomer) {
    return undefined;
  }

  const customer = await prisma.customer.update({
    where: {
      id,
    },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      company: input.company,
      status: toPrismaStatus(input.status),
    },
  });

  return mapCustomer(customer);
};

export const removeCustomerById = async (
  id: number,
): Promise<boolean> => {
  const existingCustomer =
    await prisma.customer.findUnique({
      where: {
        id,
      },
    });

  if (!existingCustomer) {
    return false;
  }

  await prisma.customer.delete({
    where: {
      id,
    },
  });

  return true;
};