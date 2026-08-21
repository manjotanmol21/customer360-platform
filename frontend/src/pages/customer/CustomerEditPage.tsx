import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import CustomerForm from "../../components/customer/CustomerForm";
import CustomerTableError from "../../components/customer/CustomerTableError";
import CustomerTableLoading from "../../components/customer/CustomerTableLoading";
import Card from "../../components/UI/Card";

import type { CustomerFormValues } from "../../features/customers/schemas/customerSchema";

import {
  useCustomer,
  useUpdateCustomer,
} from "../../hooks/useCustomer";

export default function CustomerEditPage() {
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

  const updateCustomerMutation =
    useUpdateCustomer();

  function handleRetry() {
    void refetch();
  }

  async function handleUpdateCustomer(
    formData: CustomerFormValues,
  ) {
    if (!customer) {
      return;
    }

    try {
      const updatedCustomer =
        await updateCustomerMutation.mutateAsync(
          {
            customerId: customer.id,
            customer: formData,
          },
        );

      alert(
        `${updatedCustomer.firstName} ${updatedCustomer.lastName} has been updated.`,
      );

      navigate(
        `/customers/${updatedCustomer.id}`,
        {
          replace: true,
        },
      );
    } catch {
      alert(
        "The customer could not be updated. Please try again.",
      );
    }
  }

  function handleCancel() {
    if (customer) {
      navigate(
        `/customers/${customer.id}`,
      );

      return;
    }

    navigate("/customers");
  }

  if (!hasValidCustomerId) {
    return <CustomerNotFound />;
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
            message="The customer could not be loaded for editing."
            onRetry={handleRetry}
          />
        </Card>
      </section>
    );
  }

  if (!customer) {
    return <CustomerNotFound />;
  }

  const defaultValues: CustomerFormValues =
    {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      status: customer.status,
    };

  return (
    <section>
      <div className="mb-8">
        <Link
          to={`/customers/${customer.id}`}
          className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
        >
          Back to customer
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          Edit Customer
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Update {customer.firstName}{" "}
          {customer.lastName}'s profile.
        </p>
      </div>

      <Card
        padding="large"
        shadow="small"
      >
        <CustomerForm
          defaultValues={defaultValues}
          submitLabel="Save Changes"
          loadingText="Saving..."
          onSubmit={
            handleUpdateCustomer
          }
          onCancel={handleCancel}
        />
      </Card>
    </section>
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

        <Link
          to="/customers"
          className="mt-6 inline-flex text-sm font-semibold text-blue-700 transition hover:text-blue-900"
        >
          Back to customers
        </Link>
      </Card>
    </section>
  );
}