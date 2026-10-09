import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  CustomerSortValue,
} from "../components/customer/CustomerSort";

import type {
  CustomerStatusFilterValue,
} from "../components/customer/CustomerStatusFilter";

import {
  customerQueryKeys,
} from "../features/customers/customerQueryKeys";

import type {
  CustomerQuery,
} from "../features/customers/types/customer";

import {
  getCustomers,
} from "../services/customer.service";

const PAGE_SIZE = 10;

const SEARCH_DEBOUNCE_MS = 350;

const getSortQuery = (
  sortBy: CustomerSortValue,
): Pick<
  CustomerQuery,
  "sortBy" | "sortOrder"
> => {
  switch (sortBy) {
    case "company":
      return {
        sortBy: "company",
        sortOrder: "asc",
      };

    case "created":
      return {
        sortBy: "createdAt",
        sortOrder: "desc",
      };

    default:
      return {
        sortBy: "firstName",
        sortOrder: "asc",
      };
  }
};

export function useCustomers() {
  const [searchTerm, setSearchTermState] =
    useState("");

  const [
    debouncedSearchTerm,
    setDebouncedSearchTerm,
  ] = useState("");

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
    currentPage,
    setCurrentPageState,
  ] = useState(1);

  useEffect(() => {
    const timerId = window.setTimeout(
      () => {
        setDebouncedSearchTerm(
          searchTerm.trim(),
        );
      },
      SEARCH_DEBOUNCE_MS,
    );

    return () => {
      window.clearTimeout(timerId);
    };
  }, [searchTerm]);

  const query =
    useMemo<CustomerQuery>(() => {
      const sortQuery =
        getSortQuery(sortBy);

      return {
        page: currentPage,
        pageSize: PAGE_SIZE,
        search:
          debouncedSearchTerm ||
          undefined,
        status:
          statusFilter === "All"
            ? undefined
            : statusFilter,
        ...sortQuery,
      };
    }, [
      currentPage,
      debouncedSearchTerm,
      sortBy,
      statusFilter,
    ]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey:
      customerQueryKeys.list(query),

    queryFn: () =>
      getCustomers(query),

    placeholderData:
      keepPreviousData,
  });

  const customers =
    data?.customers ?? [];

  const pagination =
    data?.pagination ?? {
      page: currentPage,
      pageSize: PAGE_SIZE,
      totalItems: 0,
      totalPages: 0,
    };


  function setSearchTerm(
    value: string,
  ): void {
    setSearchTermState(value);
    setCurrentPageState(1);
  }

  function setStatusFilter(
    value: CustomerStatusFilterValue,
  ): void {
    setStatusFilterState(value);
    setCurrentPageState(1);
  }

  function setSortBy(
    value: CustomerSortValue,
  ): void {
    setSortByState(value);
    setCurrentPageState(1);
  }

  function setCurrentPage(
    page: number,
  ): void {
    const lastAvailablePage =
      Math.max(
        pagination.totalPages,
        1,
      );

    const safePage = Math.min(
      Math.max(page, 1),
      lastAvailablePage,
    );

    setCurrentPageState(safePage);
  }

  return {
    customers,
    pagination,

    isLoading,
    isFetching,
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

    pageSize: PAGE_SIZE,
  };
}