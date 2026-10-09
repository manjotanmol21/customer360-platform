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

export interface Customer {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  company: string;

  status: CustomerStatus;

  createdAt: string;
}

export interface CustomerQuery {
  page: number;

  pageSize: number;

  search?: string;

  status?: CustomerStatus;

  sortBy: CustomerSortField;

  sortOrder: CustomerSortOrder;
}

export interface CustomerPagination {
  page: number;

  pageSize: number;

  totalItems: number;

  totalPages: number;
}

export interface CustomerPage {
  customers: Customer[];

  pagination: CustomerPagination;
}