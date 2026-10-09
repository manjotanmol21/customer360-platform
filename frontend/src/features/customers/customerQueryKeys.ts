import type {
  CustomerQuery,
} from "./types/customer";

export const customerQueryKeys = {
  all: ["customers"] as const,

  lists: () =>
    [
      ...customerQueryKeys.all,
      "list",
    ] as const,

  list: (query: CustomerQuery) =>
    [
      ...customerQueryKeys.lists(),
      query,
    ] as const,

  details: () =>
    [
      ...customerQueryKeys.all,
      "detail",
    ] as const,

  detail: (customerId: number) =>
    [
      ...customerQueryKeys.details(),
      customerId,
    ] as const,
};