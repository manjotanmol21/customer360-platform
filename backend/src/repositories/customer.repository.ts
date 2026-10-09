import { ConflictError } from "../errors/app.error.js";

import {
  CustomerStatus as PrismaCustomerStatus,
} from "../generated/prisma/enums.js";

import { prisma } from "../lib/prisma.js";

import type {
  CreateCustomerInput,
  Customer,
  CustomerPage,
  CustomerQuery,
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
    status:
      fromPrismaStatus(customer.status),
    createdAt: customer.createdAt
      .toISOString()
      .slice(0, 10),
  };
};

const isPrismaUniqueConstraintError = (
  error: unknown,
): error is { code: string } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
};

const buildCustomerWhere = (
  query: CustomerQuery,
) => {
  return {
    ...(query.status
      ? {
          status:
            toPrismaStatus(query.status),
        }
      : {}),

    ...(query.search
      ? {
          OR: [
            {
              firstName: {
                contains: query.search,
                mode: "insensitive" as const,
              },
            },
            {
              lastName: {
                contains: query.search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: query.search,
                mode: "insensitive" as const,
              },
            },
            {
              phone: {
                contains: query.search,
                mode: "insensitive" as const,
              },
            },
            {
              company: {
                contains: query.search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };
};

const buildCustomerOrderBy = (
  query: CustomerQuery,
) => {
  switch (query.sortBy) {
    case "id":
      return {
        id: query.sortOrder,
      };

    case "firstName":
      return {
        firstName: query.sortOrder,
      };

    case "lastName":
      return {
        lastName: query.sortOrder,
      };

    case "email":
      return {
        email: query.sortOrder,
      };

    case "company":
      return {
        company: query.sortOrder,
      };

    case "status":
      return {
        status: query.sortOrder,
      };

    case "createdAt":
      return {
        createdAt: query.sortOrder,
      };
  }
};

export const findAllCustomers = async (
  query: CustomerQuery,
): Promise<CustomerPage> => {
  const where =
    buildCustomerWhere(query);

  const orderBy =
    buildCustomerOrderBy(query);

  const skip =
    (query.page - 1) * query.pageSize;

  const [
    totalItems,
    customers,
  ] = await prisma.$transaction([
    prisma.customer.count({
      where,
    }),

    prisma.customer.findMany({
      where,
      orderBy:
        query.sortBy === "id"
          ? [orderBy]
          : [
              orderBy,
              {
                id: "asc",
              },
            ],
      skip,
      take: query.pageSize,
    }),
  ]);

  return {
    customers:
      customers.map(mapCustomer),

    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      totalItems,
      totalPages: Math.ceil(
        totalItems / query.pageSize,
      ),
    },
  };
};

export const findCustomerById = async (
  id: number,
): Promise<Customer | undefined> => {
  const customer =
    await prisma.customer.findUnique({
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
  try {
    const customer =
      await prisma.customer.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          company: input.company,
          status:
            toPrismaStatus(input.status),
        },
      });

    return mapCustomer(customer);
  } catch (error) {
    if (
      isPrismaUniqueConstraintError(
        error,
      )
    ) {
      throw new ConflictError(
        "A customer with this email already exists",
      );
    }

    throw error;
  }
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

  try {
    const customer =
      await prisma.customer.update({
        where: {
          id,
        },

        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          company: input.company,
          status:
            toPrismaStatus(input.status),
        },
      });

    return mapCustomer(customer);
  } catch (error) {
    if (
      isPrismaUniqueConstraintError(
        error,
      )
    ) {
      throw new ConflictError(
        "A customer with this email already exists",
      );
    }

    throw error;
  }
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