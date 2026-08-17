import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import CustomerForm from "../../components/customer/CustomerForm";
import Card from "../../components/UI/Card";

import { customers } from "../../features/customers/data/customers";

import type { CustomerFormValues } from "../../features/customers/schemas/customerSchema";

export default function CustomerEditPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const customer = customers.find(
    (item) => item.id === Number(customerId),
  );

  if (!customer) {
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
            The customer you are trying to edit does not exist.
          </p>

          <Link
            to="/customers"
            className="mt-6 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            ← Back to customers
          </Link>
        </Card>
      </section>
    );
  }

  const selectedCustomer = customer;

  const editCustomerDefaultValues: CustomerFormValues = {
    firstName: selectedCustomer.firstName,
    lastName: selectedCustomer.lastName,
    email: selectedCustomer.email,
    phone: selectedCustomer.phone,
    company: selectedCustomer.company,
    status: selectedCustomer.status,
  };

  async function handleUpdateCustomer(
    formData: CustomerFormValues,
  ) {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 700);
    });

    console.log(
      "Updated customer:",
      formData,
    );

    alert(
      `Changes saved for ${formData.firstName} ${formData.lastName}.`,
    );

    navigate(
      `/customers/${selectedCustomer.id}`,
      {
        replace: true,
      },
    );
  }

  function handleCancel() {
    navigate(
      `/customers/${selectedCustomer.id}`,
    );
  }

  return (
    <section>
      <div className="mb-8">
        <Link
          to={`/customers/${selectedCustomer.id}`}
          className="text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          ← Back to customer
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          Edit Customer
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Update the profile for{" "}
          {selectedCustomer.firstName}{" "}
          {selectedCustomer.lastName}.
        </p>
      </div>

      <Card
        padding="large"
        shadow="small"
        className="max-w-3xl"
      >
        <CustomerForm
          defaultValues={
            editCustomerDefaultValues
          }
          submitLabel="Save Changes"
          loadingText="Saving..."
          onSubmit={handleUpdateCustomer}
          onCancel={handleCancel}
        />
      </Card>
    </section>
  );
}