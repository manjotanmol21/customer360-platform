import type {
  CustomerSortValue,
  CustomerStatusFilterValue,
} from "./types/customer";

export interface CustomerUrlState {
  currentPage: number;

  searchTerm: string;

  statusFilter: CustomerStatusFilterValue;

  sortBy: CustomerSortValue;
}

const DEFAULT_CUSTOMER_URL_STATE: CustomerUrlState = {
  currentPage: 1,
  searchTerm: "",
  statusFilter: "All",
  sortBy: "name",
};

function parsePage(
  value: string | null,
): number {
  if (value === null) {
    return DEFAULT_CUSTOMER_URL_STATE.currentPage;
  }

  const parsedPage =
    Number(value);

  if (
    !Number.isSafeInteger(parsedPage) ||
    parsedPage < 1
  ) {
    return DEFAULT_CUSTOMER_URL_STATE.currentPage;
  }

  return parsedPage;
}

function parseStatusFilter(
  value: string | null,
): CustomerStatusFilterValue {
  switch (value) {
    case "Active":
    case "Pending":
    case "Inactive":
      return value;

    default:
      return DEFAULT_CUSTOMER_URL_STATE.statusFilter;
  }
}

function parseSortValue(
  value: string | null,
): CustomerSortValue {
  switch (value) {
    case "company":
    case "created":
      return value;

    default:
      return DEFAULT_CUSTOMER_URL_STATE.sortBy;
  }
}

export function readCustomerSearchParams(
  searchParams: URLSearchParams,
): CustomerUrlState {
  return {
    currentPage:
      parsePage(
        searchParams.get("page"),
      ),

    searchTerm:
      searchParams.get("search") ??
      DEFAULT_CUSTOMER_URL_STATE.searchTerm,

    statusFilter:
      parseStatusFilter(
        searchParams.get("status"),
      ),

    sortBy:
      parseSortValue(
        searchParams.get("sort"),
      ),
  };
}

export function createCustomerSearchParams(
  state: CustomerUrlState,
): URLSearchParams {
  const searchParams =
    new URLSearchParams();

  if (
    state.currentPage !==
    DEFAULT_CUSTOMER_URL_STATE.currentPage
  ) {
    searchParams.set(
      "page",
      state.currentPage.toString(),
    );
  }

  if (state.searchTerm.trim()) {
    searchParams.set(
      "search",
      state.searchTerm,
    );
  }

  if (
    state.statusFilter !==
    DEFAULT_CUSTOMER_URL_STATE.statusFilter
  ) {
    searchParams.set(
      "status",
      state.statusFilter,
    );
  }

  if (
    state.sortBy !==
    DEFAULT_CUSTOMER_URL_STATE.sortBy
  ) {
    searchParams.set(
      "sort",
      state.sortBy,
    );
  }

  return searchParams;
}