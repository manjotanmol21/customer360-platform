import apiClient from "../api/apiClient";

import type {
  Customer,
  CustomerStatus,
} from "../features/customers/types/customer";

export type CustomerInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export const getCustomers = async (): Promise<
  Customer[]
> => {
  const response = await apiClient.get<
    ApiResponse<Customer[]>
  >("/customers");

  return response.data.data;
};

export const getCustomerById = async (
  customerId: number,
): Promise<Customer> => {
  const response = await apiClient.get<
    ApiResponse<Customer>
  >(`/customers/${customerId}`);

  return response.data.data;
};

export const createCustomer = async (
  customer: CustomerInput,
): Promise<Customer> => {
  const response = await apiClient.post<
    ApiResponse<Customer>
  >("/customers", customer);

  return response.data.data;
};

export const updateCustomer = async (
  customerId: number,
  customer: CustomerInput,
): Promise<Customer> => {
  const response = await apiClient.put<
    ApiResponse<Customer>
  >(
    `/customers/${customerId}`,
    customer,
  );

  return response.data.data;
};

export const deleteCustomer = async (
  customerId: number,
): Promise<void> => {
  await apiClient.delete(
    `/customers/${customerId}`,
  );
};