import { Link, useParams } from "react-router-dom";

import Card from "../../components/UI/Card";
import { customers } from "../../features/customers/data/customers";

export default function CustomerEditPage() {
  const { customerId } = useParams();

  const customer = customers.find(
    (item) => item.id === Number(customerId),
  );

  if (!customer) {
    return (
      <section>
        <Card padding="large" shadow="small">
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

  return (
    <section>
      <div className="mb-8">
        <Link
          to={`/customers/${customer.id}`}
          className="text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          ← Back to customer
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          Edit Customer
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Update the details for {customer.firstName}{" "}
          {customer.lastName}.
        </p>
      </div>

      <Card
        padding="large"
        shadow="small"
        className="max-w-3xl"
      >
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-950">
            Edit form coming next
          </p>

          <p className="mt-2 text-sm leading-6 text-blue-900">
            This route is now working correctly. In the next step,
            we will build the actual edit form using React Hook Form
            and Zod.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-slate-500">
              First Name
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {customer.firstName}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Last Name
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {customer.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Email
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {customer.email}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Company
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {customer.company}
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}