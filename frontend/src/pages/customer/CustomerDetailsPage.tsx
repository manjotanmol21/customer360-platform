import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import CustomerDeleteModal from "../../components/customer/CustomerDeleteModal";
import CustomerDetailField from "../../components/customer/CustomerDetailField";
import CustomerTableError from "../../components/customer/CustomerTableError";
import CustomerTableLoading from "../../components/customer/CustomerTableLoading";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";

import {
  useCustomer,
  useDeleteCustomer,
} from "../../hooks/useCustomer";

export default function CustomerDetailsPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const customerIdNumber =
    Number(customerId);

  const hasValidCustomerId =
    Number.isInteger(customerIdNumber) &&
    customerIdNumber > 0;

  const {
    data: customer,
    isLoading,
    isError,
    refetch,
  } = useCustomer(
    hasValidCustomerId
      ? customerIdNumber
      : undefined,
  );

  const deleteCustomerMutation =
    useDeleteCustomer();

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  function handleRetry() {
    void refetch();
  }

  function handleEditCustomer() {
    if (!customer) {
      return;
    }

    navigate(
      `/customers/${customer.id}/edit`,
    );
  }

  function handleOpenDeleteModal() {
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal() {
    if (
      deleteCustomerMutation.isPending
    ) {
      return;
    }

    setIsDeleteModalOpen(false);
  }

  async function handleConfirmDelete() {
    if (!customer) {
      return;
    }

    try {
      await deleteCustomerMutation.mutateAsync(
        customer.id,
      );

      alert(
        `${customer.firstName} ${customer.lastName} has been deleted.`,
      );

      navigate("/customers", {
        replace: true,
      });
    } catch {
      alert(
        "The customer could not be deleted. Please try again.",
      );
    }
  }

  if (!hasValidCustomerId) {
    return (
      <CustomerNotFound />
    );
  }

  if (isLoading) {
    return (
      <section>
        <Card
          padding="large"
          shadow="small"
        >
          <CustomerTableLoading />
        </Card>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <Card
          padding="large"
          shadow="small"
        >
          <CustomerTableError
            message="The customer could not be loaded. It may not exist, or the API may be unavailable."
            onRetry={handleRetry}
          />

          <BackToCustomersLink />
        </Card>
      </section>
    );
  }

  if (!customer) {
    return (
      <CustomerNotFound />
    );
  }

  const statusClasses = [
    "inline-flex rounded-full px-3 py-1 text-xs font-medium",

    customer.status === "Active"
      ? "bg-green-100 text-green-700"
      : customer.status ===
          "Pending"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-600",
  ].join(" ");

  return (
    <>
      <section>
        <div className="mb-8">
          <BackToCustomersLink />

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                {customer.firstName}{" "}
                {customer.lastName}
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Customer profile and
                account information.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={
                  handleEditCustomer
                }
              >
                Edit Customer
              </Button>

              <Button
                variant="danger"
                onClick={
                  handleOpenDeleteModal
                }
              >
                Delete Customer
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card
            padding="large"
            shadow="small"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              Contact Information
            </h2>

            <dl className="mt-6 space-y-5">
              <CustomerDetailField
                label="Full Name"
                value={`${customer.firstName} ${customer.lastName}`}
              />

              <CustomerDetailField
                label="Email"
                value={customer.email}
              />

              <CustomerDetailField
                label="Phone"
                value={customer.phone}
              />
            </dl>
          </Card>

          <Card
            padding="large"
            shadow="small"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              Account Information
            </h2>

            <dl className="mt-6 space-y-5">
              <CustomerDetailField
                label="Company"
                value={customer.company}
              />

              <div>
                <dt className="text-sm font-medium text-slate-500">
                  Status
                </dt>

                <dd className="mt-2">
                  <span
                    className={
                      statusClasses
                    }
                  >
                    {customer.status}
                  </span>
                </dd>
              </div>

              <CustomerDetailField
                label="Customer Since"
                value={
                  customer.createdAt
                }
              />

              <CustomerDetailField
                label="Customer ID"
                value={String(
                  customer.id,
                )}
              />
            </dl>
          </Card>
        </div>
      </section>

      <CustomerDeleteModal
        customerName={`${customer.firstName} ${customer.lastName}`}
        isOpen={isDeleteModalOpen}
        isDeleting={
          deleteCustomerMutation.isPending
        }
        onCancel={
          handleCloseDeleteModal
        }
        onConfirm={
          handleConfirmDelete
        }
      />
    </>
  );
}

function BackToCustomersLink() {
  return (
    <Link
      to="/customers"
      className="mt-6 inline-flex text-sm font-semibold text-blue-700 transition hover:text-blue-900"
    >
      Back to customers
    </Link>
  );
}

function CustomerNotFound() {
  return (
    <section>
      <Card
        padding="large"
        shadow="small"
      >
        <h1 className="text-2xl font-bold text-slate-950">
          Customer not found
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          The customer you requested
          does not exist.
        </p>

        <BackToCustomersLink />
      </Card>
    </section>
  );
}