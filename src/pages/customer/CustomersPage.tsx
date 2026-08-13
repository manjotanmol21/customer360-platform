import {
  useEffect,
  useMemo,
  useState,
} from "react";

import CustomerEmptyState from "../../components/customer/CustomerEmptyState";
import CustomerPagination from "../../components/customer/CustomerPagination";
import CustomerSearch from "../../components/customer/CustomerSearch";
import CustomerSort, {
  type CustomerSortValue,
} from "../../components/customer/CustomerSort";
import CustomerStatusFilter, {
  type CustomerStatusFilterValue,
} from "../../components/customer/CustomerStatusFilter";
import CustomerTable from "../../components/customer/CustomerTable";
import Card from "../../components/UI/Card";
import { customers } from "../../features/customers/data/customers";

const PAGE_SIZE = 2;

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<CustomerStatusFilterValue>("All");

  const [sortBy, setSortBy] =
    useState<CustomerSortValue>("name");

  const [currentPage, setCurrentPage] =
    useState(1);

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredCustomers = customers.filter(
    (customer) => {
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
    },
  );

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
  }, [filteredCustomers, sortBy]);

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
  }, [currentPage, sortedCustomers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    sortBy,
  ]);

  const hasCustomers =
    sortedCustomers.length > 0;

  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Customers
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          View and manage customers in the Customer360 platform.
        </p>
      </div>

      <Card
        padding="medium"
        shadow="small"
        className="mt-8"
      >
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <CustomerSearch
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          <CustomerStatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
          />

          <CustomerSort
            value={sortBy}
            onChange={setSortBy}
          />
        </div>

        {hasCustomers ? (
          <>
            <div className="mb-4 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing{" "}
                {paginatedCustomers.length} of{" "}
                {sortedCustomers.length} customers
              </p>

              <p>
                Page {currentPage} of {totalPages}
              </p>
            </div>

            <CustomerTable
              customers={paginatedCustomers}
            />

            <CustomerPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <CustomerEmptyState
            searchTerm={searchTerm}
          />
        )}
      </Card>
    </section>
  );
}