export type Customer = {
  id: number;
  name: string;
  email: string;
  company: string;
};

export type CreateCustomerInput = {
  name: string;
  email: string;
  company: string;
};

export type UpdateCustomerInput = {
  name: string;
  email: string;
  company: string;
};

const customers: Customer[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    company: "Acme Ltd",
  },
  {
    id: 2,
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    company: "Globex Corporation",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    company: "Initech",
  },
];

export const getAllCustomers = (): Customer[] => {
  return customers;
};

export const getCustomerById = (id: number): Customer | undefined => {
  return customers.find((customer) => customer.id === id);
};

export const createCustomer = (
  input: CreateCustomerInput,
): Customer => {
  const nextId =
    customers.length === 0
      ? 1
      : Math.max(...customers.map((customer) => customer.id)) + 1;

  const newCustomer: Customer = {
    id: nextId,
    name: input.name,
    email: input.email,
    company: input.company,
  };

  customers.push(newCustomer);

  return newCustomer;
};

export const updateCustomer = (
  id: number,
  input: UpdateCustomerInput,
): Customer | undefined => {
  const customer = customers.find((customer) => customer.id === id);

  if (!customer) {
    return undefined;
  }

  customer.name = input.name;
  customer.email = input.email;
  customer.company = input.company;

  return customer;
};

export const deleteCustomer = (id: number): boolean => {
  const customerIndex = customers.findIndex(
    (customer) => customer.id === id,
  );

  if (customerIndex === -1) {
    return false;
  }

  customers.splice(customerIndex, 1);

  return true;
};