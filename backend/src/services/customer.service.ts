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

export type CustomerSortField =
  | "id"
  | "firstName"
  | "lastName"
  | "email"
  | "company"
  | "status"
  | "createdAt";

export type CustomerSortOrder =
  | "asc"
  | "desc";

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

export type CustomerQuery = {
  page: number;
  pageSize: number;
  search?: string;
  status?: CustomerStatus;
  sortBy: CustomerSortField;
  sortOrder: CustomerSortOrder;
};

export type CustomerPagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type CustomerPage = {
  customers: Customer[];
  pagination: CustomerPagination;
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

export const getAllCustomers = async (
  query: CustomerQuery,
): Promise<CustomerPage> => {
  return findAllCustomers(query);
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