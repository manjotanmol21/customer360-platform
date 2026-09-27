import { useQuery } from "@tanstack/react-query";
import {
  useMemo,
  useState,
} from "react";

import type { CustomerSortValue } from "../components/customer/CustomerSort";
import type { CustomerStatusFilterValue } from "../components/customer/CustomerStatusFilter";

import { getCustomers as fetchCustomers } from "../services/customer.service";

const PAGE_SIZE = 2;

export function useCustomers() {
  const {
    data: customers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const [searchTerm, setSearchTermState] =
    useState("");

  const [
    statusFilter,
    setStatusFilterState,
  ] =
    useState<CustomerStatusFilterValue>(
      "All",
    );

  const [sortBy, setSortByState] =
    useState<CustomerSortValue>("name");

  const [
    requestedPage,
    setRequestedPage,
  ] = useState(1);

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(
          normalizedSearch,
        ) ||
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

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    customers,
    normalizedSearch,
    statusFilter,
  ]);

  const sortedCustomers = useMemo(() => {
    const copy = [...filteredCustomers];

    switch (sortBy) {
      case "company":
        copy.sort((a, b) =>
          a.company.localeCompare(
            b.company,
          ),
        );
        break;

      case "created":
        copy.sort((a, b) =>
          a.createdAt.localeCompare(
            b.createdAt,
          ),
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

  const currentPage = Math.min(
    requestedPage,
    Math.max(totalPages, 1),
  );

  const paginatedCustomers =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        PAGE_SIZE;

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

  function setSearchTerm(
    value: string,
  ): void {
    setSearchTermState(value);
    setRequestedPage(1);
  }

  function setStatusFilter(
    value: CustomerStatusFilterValue,
  ): void {
    setStatusFilterState(value);
    setRequestedPage(1);
  }

  function setSortBy(
    value: CustomerSortValue,
  ): void {
    setSortByState(value);
    setRequestedPage(1);
  }

  function setCurrentPage(
    page: number,
  ): void {
    const lastAvailablePage =
      Math.max(totalPages, 1);

    const safePage = Math.min(
      Math.max(page, 1),
      lastAvailablePage,
    );

    setRequestedPage(safePage);
  }

  return {
    customers,
    isLoading,
    isError,
    error,
    refetch,

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