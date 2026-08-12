export type CustomerStatus =
  | "Active"
  | "Inactive"
  | "Pending";

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


