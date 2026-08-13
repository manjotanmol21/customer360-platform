import { useMemo, useState } from "react";

import CustomerEmptyState from "../../components/customer/CustomerEmptyState";
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

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<CustomerStatusFilterValue>("All");

  const [sortBy, setSortBy] =
    useState<CustomerSortValue>("name");

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
        <div className="mb-6 flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
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

        {sortedCustomers.length > 0 ? (
          <CustomerTable
            customers={sortedCustomers}
          />
        ) : (
          <CustomerEmptyState
            searchTerm={searchTerm}
          />
        )}
      </Card>
    </section>
  );
}