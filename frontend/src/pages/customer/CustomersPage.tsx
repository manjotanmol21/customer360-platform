import { Link } from "react-router-dom";

import CustomerEmptyState from "../../components/customer/CustomerEmptyState";
import CustomerPagination from "../../components/customer/CustomerPagination";
import CustomerSearch from "../../components/customer/CustomerSearch";
import CustomerSort from "../../components/customer/CustomerSort";
import CustomerStatusFilter from "../../components/customer/CustomerStatusFilter";
import CustomerTable from "../../components/customer/CustomerTable";
import CustomerTableError from "../../components/customer/CustomerTableError";
import CustomerTableLoading from "../../components/customer/CustomerTableLoading";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";

import { useCustomers } from "../../hooks/useCustomers";

export default function CustomersPage() {
  const {
    searchTerm,
    setSearchTerm,

    statusFilter,
    setStatusFilter,

    sortBy,
    setSortBy,

    currentPage,
    setCurrentPage,

    sortedCustomers,
    paginatedCustomers,
    totalPages,
  } = useCustomers();

  const isLoading = false;
  const isError = false;

  const hasCustomers =
    sortedCustomers.length > 0;

  function renderCustomerContent() {
    if (isLoading) {
      return <CustomerTableLoading />;
    }

    if (isError) {
      return (
        <CustomerTableError
          message="Please try again in a few moments."
        />
      );
    }

    if (!hasCustomers) {
      return (
        <CustomerEmptyState
          searchTerm={searchTerm}
        />
      );
    }

    return (
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
    );
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Customers
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            View and manage customers in the Customer360 platform.
          </p>
        </div>

        <Link to="/customers/new">
          <Button>
            Add Customer
          </Button>
        </Link>
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

        {renderCustomerContent()}
      </Card>
    </section>
  );
}