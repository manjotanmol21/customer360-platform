export type CustomerStatus =
  | "Active"
  | "Inactive"
  | "Pending";

export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  createdAt: string;
};

export type CreateCustomerInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
};

export type UpdateCustomerInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
};

const customerStatuses: CustomerStatus[] = [
  "Active",
  "Inactive",
  "Pending",
];

const customers: Customer[] = [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Brown",
    email: "alice.brown@example.com",
    phone: "+64 21 123 4567",
    company: "ABC Solutions",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: 2,
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    phone: "+64 27 555 7788",
    company: "Northwind Ltd",
    status: "Active",
    createdAt: "2026-02-18",
  },
  {
    id: 3,
    firstName: "Sophia",
    lastName: "Taylor",
    email: "sophia.taylor@example.com",
    phone: "+64 22 444 6677",
    company: "BluePeak Technologies",
    status: "Pending",
    createdAt: "2026-03-10",
  },
  {
    id: 4,
    firstName: "Daniel",
    lastName: "Wilson",
    email: "daniel.wilson@example.com",
    phone: "+64 29 888 1122",
    company: "Global Retail",
    status: "Inactive",
    createdAt: "2026-04-08",
  },
  {
    id: 5,
    firstName: "Emma",
    lastName: "Thomas",
    email: "emma.thomas@example.com",
    phone: "+64 20 999 3344",
    company: "TechNova",
    status: "Active",
    createdAt: "2026-05-01",
  },
];

export const isCustomerStatus = (
  value: unknown,
): value is CustomerStatus => {
  return (
    typeof value === "string" &&
    customerStatuses.includes(
      value as CustomerStatus,
    )
  );
};

export const getAllCustomers = (): Customer[] => {
  return customers;
};

export const getCustomerById = (
  id: number,
): Customer | undefined => {
  return customers.find(
    (customer) => customer.id === id,
  );
};

export const createCustomer = (
  input: CreateCustomerInput,
): Customer => {
  const nextId =
    customers.length === 0
      ? 1
      : Math.max(
          ...customers.map(
            (customer) => customer.id,
          ),
        ) + 1;

  const newCustomer: Customer = {
    id: nextId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    company: input.company,
    status: input.status,
    createdAt: new Date()
      .toISOString()
      .slice(0, 10),
  };

  customers.push(newCustomer);

  return newCustomer;
};

export const updateCustomer = (
  id: number,
  input: UpdateCustomerInput,
): Customer | undefined => {
  const customer = customers.find(
    (existingCustomer) =>
      existingCustomer.id === id,
  );

  if (!customer) {
    return undefined;
  }

  customer.firstName = input.firstName;
  customer.lastName = input.lastName;
  customer.email = input.email;
  customer.phone = input.phone;
  customer.company = input.company;
  customer.status = input.status;

  return customer;
};

export const deleteCustomer = (
  id: number,
): boolean => {
  const customerIndex =
    customers.findIndex(
      (customer) => customer.id === id,
    );

  if (customerIndex === -1) {
    return false;
  }

  customers.splice(customerIndex, 1);

  return true;
};