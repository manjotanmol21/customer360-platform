import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createCustomerSearchParams,
  readCustomerSearchParams,
} from "./customerSearchParams";

describe(
  "readCustomerSearchParams",
  () => {
    it(
      "returns the default customer URL state when parameters are absent",
      () => {
        const result =
          readCustomerSearchParams(
            new URLSearchParams(),
          );

        expect(result).toEqual({
          currentPage: 1,
          searchTerm: "",
          statusFilter: "All",
          sortBy: "name",
        });
      },
    );

    it(
      "reads a complete valid customer URL state",
      () => {
        const result =
          readCustomerSearchParams(
            new URLSearchParams({
              page: "2",
              search: "singh",
              status: "Pending",
              sort: "company",
            }),
          );

        expect(result).toEqual({
          currentPage: 2,
          searchTerm: "singh",
          statusFilter: "Pending",
          sortBy: "company",
        });
      },
    );

    it(
      "defaults invalid page values to page one",
      () => {
        const invalidPages = [
          "0",
          "-4",
          "1.5",
          "invalid",
          "",
        ];

        for (
          const invalidPage
          of invalidPages
        ) {
          const result =
            readCustomerSearchParams(
              new URLSearchParams({
                page: invalidPage,
              }),
            );

          expect(
            result.currentPage,
          ).toBe(1);
        }
      },
    );

    it(
      "accepts each supported customer status",
      () => {
        const statuses = [
          "Active",
          "Pending",
          "Inactive",
        ] as const;

        for (const status of statuses) {
          const result =
            readCustomerSearchParams(
              new URLSearchParams({
                status,
              }),
            );

          expect(
            result.statusFilter,
          ).toBe(status);
        }
      },
    );

    it(
      "defaults an unsupported status to All",
      () => {
        const result =
          readCustomerSearchParams(
            new URLSearchParams({
              status: "Unknown",
            }),
          );

        expect(
          result.statusFilter,
        ).toBe("All");
      },
    );

    it(
      "accepts supported sorting values and defaults unsupported values",
      () => {
        expect(
          readCustomerSearchParams(
            new URLSearchParams({
              sort: "company",
            }),
          ).sortBy,
        ).toBe("company");

        expect(
          readCustomerSearchParams(
            new URLSearchParams({
              sort: "created",
            }),
          ).sortBy,
        ).toBe("created");

        expect(
          readCustomerSearchParams(
            new URLSearchParams({
              sort: "invalid",
            }),
          ).sortBy,
        ).toBe("name");
      },
    );
  },
);

describe(
  "createCustomerSearchParams",
  () => {
    it(
      "omits all default values",
      () => {
        const result =
          createCustomerSearchParams({
            currentPage: 1,
            searchTerm: "",
            statusFilter: "All",
            sortBy: "name",
          });

        expect(
          result.toString(),
        ).toBe("");
      },
    );

    it(
      "serializes every non-default customer query value",
      () => {
        const result =
          createCustomerSearchParams({
            currentPage: 3,
            searchTerm: "Aarav Sharma",
            statusFilter: "Active",
            sortBy: "company",
          });

        expect(
          result.get("page"),
        ).toBe("3");

        expect(
          result.get("search"),
        ).toBe("Aarav Sharma");

        expect(
          result.get("status"),
        ).toBe("Active");

        expect(
          result.get("sort"),
        ).toBe("company");
      },
    );

    it(
      "omits a search value containing only whitespace",
      () => {
        const result =
          createCustomerSearchParams({
            currentPage: 1,
            searchTerm: "   ",
            statusFilter: "All",
            sortBy: "name",
          });

        expect(
          result.has("search"),
        ).toBe(false);
      },
    );

    it(
      "round-trips a valid customer URL state",
      () => {
        const originalState = {
          currentPage: 2,
          searchTerm: "singh",
          statusFilter:
            "Pending" as const,
          sortBy:
            "created" as const,
        };

        const serializedState =
          createCustomerSearchParams(
            originalState,
          );

        const parsedState =
          readCustomerSearchParams(
            serializedState,
          );

        expect(parsedState).toEqual(
          originalState,
        );
      },
    );
  },
);