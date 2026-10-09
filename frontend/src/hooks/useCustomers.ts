import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  customerQueryKeys,
} from "../features/customers/customerQueryKeys";

import {
  createCustomerSearchParams,
  readCustomerSearchParams,
  type CustomerUrlState,
} from "../features/customers/customerSearchParams";

import type {
  CustomerQuery,
  CustomerSortValue,
  CustomerStatusFilterValue,
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
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const urlState =
    useMemo(
      () =>
        readCustomerSearchParams(
          searchParams,
        ),
      [searchParams],
    );

  const {
    currentPage,
    searchTerm,
    statusFilter,
    sortBy,
  } = urlState;

  const [
    debouncedSearchTerm,
    setDebouncedSearchTerm,
  ] = useState(searchTerm.trim());

  const canonicalSearchParams =
    useMemo(
      () =>
        createCustomerSearchParams(
          urlState,
        ),
      [urlState],
    );

  useEffect(() => {
    if (
      searchParams.toString() !==
      canonicalSearchParams.toString()
    ) {
      setSearchParams(
        canonicalSearchParams,
        {
          replace: true,
        },
      );
    }
  }, [
    canonicalSearchParams,
    searchParams,
    setSearchParams,
  ]);

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

  function writeUrlState(
    nextState: CustomerUrlState,
    replace = false,
  ): void {
    setSearchParams(
      createCustomerSearchParams(
        nextState,
      ),
      {
        replace,
      },
    );
  }

  function setSearchTerm(
    value: string,
  ): void {
    writeUrlState(
      {
        ...urlState,
        currentPage: 1,
        searchTerm: value,
      },
      true,
    );
  }

  function setStatusFilter(
    value: CustomerStatusFilterValue,
  ): void {
    writeUrlState({
      ...urlState,
      currentPage: 1,
      statusFilter: value,
    });
  }

  function setSortBy(
    value: CustomerSortValue,
  ): void {
    writeUrlState({
      ...urlState,
      currentPage: 1,
      sortBy: value,
    });
  }

  function setCurrentPage(
    page: number,
  ): void {
    const lastAvailablePage =
      Math.max(
        pagination.totalPages,
        1,
      );

    const safePage =
      Math.min(
        Math.max(page, 1),
        lastAvailablePage,
      );

    writeUrlState({
      ...urlState,
      currentPage: safePage,
    });
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