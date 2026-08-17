import {
  Link,
  useNavigate,
} from "react-router-dom";

import CustomerForm from "../../components/customer/CustomerForm";
import Card from "../../components/UI/Card";

import type { CustomerFormValues } from "../../features/customers/schemas/customerSchema";

const createCustomerDefaultValues: CustomerFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  status: "Pending",
};

export default function CustomerCreatePage() {
  const navigate = useNavigate();

  async function handleCreateCustomer(
    formData: CustomerFormValues,
  ) {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 700);
    });

    console.log(
      "New customer:",
      formData,
    );

    alert(
      `${formData.firstName} ${formData.lastName} has been created.`,
    );

    navigate("/customers", {
      replace: true,
    });
  }

  function handleCancel() {
    navigate("/customers");
  }

  return (
    <section>
      <div className="mb-8">
        <Link
          to="/customers"
          className="text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          ← Back to customers
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          Add Customer
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Create a new customer profile in Customer360.
        </p>
      </div>

      <Card
        padding="large"
        shadow="small"
        className="max-w-3xl"
      >
        <CustomerForm
          defaultValues={
            createCustomerDefaultValues
          }
          submitLabel="Create Customer"
          loadingText="Creating..."
          onSubmit={handleCreateCustomer}
          onCancel={handleCancel}
        />
      </Card>
    </section>
  );
}