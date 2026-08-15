import { Link, useParams } from "react-router-dom";

import CustomerDetailField from "../../components/customer/CustomerDetailField";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import { customers } from "../../features/customers/data/customers";

export default function CustomerDetailsPage() {
  const { customerId } = useParams();

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
            The customer you requested does not exist.
          </p>

          <Link
            to="/customers"
            className="mt-6 inline-flex text-sm font-semibold text-blue-700 transition hover:text-blue-900"
          >
            ← Back to customers
          </Link>
        </Card>
      </section>
    );
  }

  /*
   * At this point customer cannot be undefined because
   * the component already returned above when no customer
   * was found.
   *
   * Creating this alias also makes the TypeScript type
   * explicit and safe inside callback functions.
   */
  const selectedCustomer = customer;

  const statusClasses = [
    "inline-flex rounded-full px-3 py-1 text-xs font-medium",
    selectedCustomer.status === "Active"
      ? "bg-green-100 text-green-700"
      : selectedCustomer.status === "Pending"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-600",
  ].join(" ");

  function handleEditCustomer() {
    alert(
      `Edit customer functionality will be added for ${selectedCustomer.firstName} ${selectedCustomer.lastName}.`,
    );
  }

  function handleDeleteCustomer() {
    alert(
      `Delete customer functionality will be added for ${selectedCustomer.firstName} ${selectedCustomer.lastName}.`,
    );
  }

  return (
    <section>
      <div className="mb-8">
        <Link
          to="/customers"
          className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
        >
          ← Back to customers
        </Link>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              {selectedCustomer.firstName}{" "}
              {selectedCustomer.lastName}
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Customer profile and account information.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={handleEditCustomer}
            >
              Edit Customer
            </Button>

            <Button
              variant="danger"
              onClick={handleDeleteCustomer}
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
              value={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
            />

            <CustomerDetailField
              label="Email"
              value={selectedCustomer.email}
            />

            <CustomerDetailField
              label="Phone"
              value={selectedCustomer.phone}
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
              value={selectedCustomer.company}
            />

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Status
              </dt>

              <dd className="mt-2">
                <span className={statusClasses}>
                  {selectedCustomer.status}
                </span>
              </dd>
            </div>

            <CustomerDetailField
              label="Customer Since"
              value={selectedCustomer.createdAt}
            />

            <CustomerDetailField
              label="Customer ID"
              value={String(selectedCustomer.id)}
            />
          </dl>
        </Card>
      </div>
    </section>
  );
}