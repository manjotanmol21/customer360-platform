import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { CustomerSortValue } from "../components/customer/CustomerSort";
import type { CustomerStatusFilterValue } from "../components/customer/CustomerStatusFilter";

import { customers } from "../features/customers/data/customers";

const PAGE_SIZE = 2;

export function useCustomers() {
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<CustomerStatusFilterValue>("All");

  const [sortBy, setSortBy] =
    useState<CustomerSortValue>("name");

  const [currentPage, setCurrentPage] =
    useState(1);

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(normalizedSearch) ||
        customer.company
          .toLowerCase()
          .includes(normalizedSearch) ||
        customer.email
          .toLowerCase()
          .includes(normalizedSearch) ||
        customer.phone
          .toLowerCase()
          .includes(normalizedSearch) ||
        customer.status
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    normalizedSearch,
    statusFilter,
  ]);

  const sortedCustomers = useMemo(() => {
    const copy = [...filteredCustomers];

    switch (sortBy) {
      case "company":
        copy.sort((a, b) =>
          a.company.localeCompare(b.company),
        );
        break;

      case "created":
        copy.sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt),
        );
        break;

      default:
        copy.sort((a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`,
          ),
        );
    }

    return copy;
  }, [
    filteredCustomers,
    sortBy,
  ]);

  const totalPages = Math.ceil(
    sortedCustomers.length / PAGE_SIZE,
  );

  const paginatedCustomers = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PAGE_SIZE;

    const endIndex =
      startIndex + PAGE_SIZE;

    return sortedCustomers.slice(
      startIndex,
      endIndex,
    );
  }, [
    currentPage,
    sortedCustomers,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    sortBy,
  ]);

  return {
    searchTerm,
    setSearchTerm,

    statusFilter,
    setStatusFilter,

    sortBy,
    setSortBy,

    currentPage,
    setCurrentPage,

    filteredCustomers,
    sortedCustomers,
    paginatedCustomers,

    totalPages,
    pageSize: PAGE_SIZE,
  };
}