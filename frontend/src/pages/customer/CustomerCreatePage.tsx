import {
  Link,
  useNavigate,
} from "react-router-dom";

import CustomerForm from "../../components/customer/CustomerForm";
import Card from "../../components/UI/Card";

import type { CustomerFormValues } from "../../features/customers/schemas/customerSchema";

import { useCreateCustomer } from "../../hooks/useCustomer";

const createCustomerDefaultValues: CustomerFormValues =
  {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    status: "Pending",
  };

export default function CustomerCreatePage() {
  const navigate = useNavigate();

  const createCustomerMutation =
    useCreateCustomer();

  async function handleCreateCustomer(
    formData: CustomerFormValues,
  ) {
    try {
      const customer =
        await createCustomerMutation.mutateAsync(
          formData,
        );

      alert(
        `${customer.firstName} ${customer.lastName} has been created.`,
      );

      navigate(
        `/customers/${customer.id}`,
        {
          replace: true,
        },
      );
    } catch {
      alert(
        "The customer could not be created. Please try again.",
      );
    }
  }

  function handleCancel() {
    navigate("/customers");
  }

  return (
    <section>
      <div className="mb-8">
        <Link
          to="/customers"
          className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
        >
          Back to customers
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          Add Customer
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Create a customer profile in
          the Customer360 platform.
        </p>
      </div>

      <Card
        padding="large"
        shadow="small"
      >
        <CustomerForm
          defaultValues={
            createCustomerDefaultValues
          }
          submitLabel="Create Customer"
          loadingText="Creating..."
          onSubmit={
            handleCreateCustomer
          }
          onCancel={handleCancel}
        />
      </Card>
    </section>
  );
}