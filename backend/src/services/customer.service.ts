import {
  findAllCustomers,
  findCustomerById,
  insertCustomer,
  modifyCustomer,
  removeCustomerById,
} from "../repositories/customer.repository.js";

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

export const getAllCustomers = async (): Promise<Customer[]> => {
  return findAllCustomers();
};

export const getCustomerById = async (
  id: number,
): Promise<Customer | undefined> => {
  return findCustomerById(id);
};

export const createCustomer = async (
  input: CreateCustomerInput,
): Promise<Customer> => {
  return insertCustomer(input);
};

export const updateCustomer = async (
  id: number,
  input: UpdateCustomerInput,
): Promise<Customer | undefined> => {
  return modifyCustomer(id, input);
};

export const deleteCustomer = async (
  id: number,
): Promise<boolean> => {
  return removeCustomerById(id);
};