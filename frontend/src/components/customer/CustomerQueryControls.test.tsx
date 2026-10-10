import {
  useState,
} from "react";

import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import axe from "axe-core";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import CustomerEmptyState from "./CustomerEmptyState";
import CustomerPagination from "./CustomerPagination";
import CustomerSearch from "./CustomerSearch";
import CustomerSort from "./CustomerSort";
import CustomerStatusFilter from "./CustomerStatusFilter";

function SearchHarness() {
  const [
    value,
    setValue,
  ] = useState("");

  return (
    <CustomerSearch
      value={value}
      onChange={setValue}
    />
  );
}

describe(
  "customer query controls",
  () => {
    it(
      "updates the search field through keyboard input",
      async () => {
        const user =
          userEvent.setup();

        render(
          <SearchHarness />,
        );

        const searchInput =
          screen.getByRole(
            "searchbox",
            {
              name: "Search customers",
            },
          );

        await user.type(
          searchInput,
          "singh",
        );

        expect(
          searchInput,
        ).toHaveValue("singh");
      },
    );

    it(
      "reports a selected customer status",
      async () => {
        const user =
          userEvent.setup();

        const onChange =
          vi.fn();

        render(
          <CustomerStatusFilter
            value="All"
            onChange={onChange}
          />,
        );

        const statusFilter =
          screen.getByRole(
            "combobox",
            {
              name:
                "Filter customers by status",
            },
          );

        await user.selectOptions(
          statusFilter,
          "Pending",
        );

        expect(
          onChange,
        ).toHaveBeenCalledWith(
          "Pending",
        );
      },
    );

    it(
      "reports a selected customer sort option",
      async () => {
        const user =
          userEvent.setup();

        const onChange =
          vi.fn();

        render(
          <CustomerSort
            value="name"
            onChange={onChange}
          />,
        );

        const sortControl =
          screen.getByRole(
            "combobox",
            {
              name: "Sort customers",
            },
          );

        await user.selectOptions(
          sortControl,
          "created",
        );

        expect(
          onChange,
        ).toHaveBeenCalledWith(
          "created",
        );
      },
    );

    it(
      "does not render pagination for a single page",
      () => {
        render(
          <CustomerPagination
            currentPage={1}
            totalPages={1}
            onPageChange={vi.fn()}
          />,
        );

        expect(
          screen.queryByRole(
            "navigation",
            {
              name:
                "Customer pagination",
            },
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "disables Previous and advances from the first page",
      async () => {
        const user =
          userEvent.setup();

        const onPageChange =
          vi.fn();

        render(
          <CustomerPagination
            currentPage={1}
            totalPages={3}
            onPageChange={
              onPageChange
            }
          />,
        );

        expect(
          screen.getByRole(
            "button",
            {
              name: "Previous",
            },
          ),
        ).toBeDisabled();

        expect(
          screen.getByText(
            "Page 1 of 3",
          ),
        ).toBeInTheDocument();

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Next",
            },
          ),
        );

        expect(
          onPageChange,
        ).toHaveBeenCalledWith(2);
      },
    );

    it(
      "disables Next and moves backwards from the last page",
      async () => {
        const user =
          userEvent.setup();

        const onPageChange =
          vi.fn();

        render(
          <CustomerPagination
            currentPage={3}
            totalPages={3}
            onPageChange={
              onPageChange
            }
          />,
        );

        expect(
          screen.getByRole(
            "button",
            {
              name: "Next",
            },
          ),
        ).toBeDisabled();

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Previous",
            },
          ),
        );

        expect(
          onPageChange,
        ).toHaveBeenCalledWith(2);
      },
    );
  },
);

describe(
  "customer empty state",
  () => {
    it(
      "explains that no customers have been added",
      () => {
        render(
          <CustomerEmptyState
            searchTerm=""
            statusFilter="All"
          />,
        );

        expect(
          screen.getByText(
            "No customers have been added yet.",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "describes an empty search result",
      () => {
        render(
          <CustomerEmptyState
            searchTerm="  singh  "
            statusFilter="All"
          />,
        );

        expect(
          screen.getByText(
            'No customers match "singh". Try a different search term.',
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "describes an empty status result",
      () => {
        render(
          <CustomerEmptyState
            searchTerm=""
            statusFilter="Inactive"
          />,
        );

        expect(
          screen.getByText(
            "No inactive customers were found. Try a different status filter.",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "describes combined empty search and status results",
      () => {
        render(
          <CustomerEmptyState
            searchTerm="singh"
            statusFilter="Pending"
          />,
        );

        expect(
          screen.getByText(
            'No pending customers match "singh". Try changing the search or status filter.',
          ),
        ).toBeInTheDocument();
      },
    );
  },
);

describe(
  "customer query accessibility",
  () => {
    it(
      "has no automatically detectable accessibility violations",
      async () => {
        const {
          container,
        } = render(
          <main>
            <h1>Customers</h1>

            <section
              aria-labelledby="customer-list-heading"
            >
              <h2 id="customer-list-heading">
                Customer list
              </h2>

              <CustomerSearch
                value=""
                onChange={vi.fn()}
              />

              <CustomerStatusFilter
                value="All"
                onChange={vi.fn()}
              />

              <CustomerSort
                value="name"
                onChange={vi.fn()}
              />

              <CustomerPagination
                currentPage={1}
                totalPages={3}
                onPageChange={vi.fn()}
              />

              <CustomerEmptyState
                searchTerm=""
                statusFilter="All"
              />
            </section>
          </main>,
        );

        const result =
          await axe.run(
            container,
            {
              rules: {
                "color-contrast": {
                  enabled: false,
                },
              },
            },
          );

        expect(
          result.violations,
        ).toEqual([]);
      },
    );
  },
);