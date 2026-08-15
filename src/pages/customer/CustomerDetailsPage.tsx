import { Link, useParams } from "react-router-dom";

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
          to="/customers"
          className="text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          ← Back to customers
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          {customer.firstName} {customer.lastName}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Customer profile and account information.
        </p>
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
            <div>
              <dt className="text-sm font-medium text-slate-500">
                Full Name
              </dt>

              <dd className="mt-1 text-sm font-medium text-slate-900">
                {customer.firstName} {customer.lastName}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Email
              </dt>

              <dd className="mt-1 text-sm text-slate-900">
                {customer.email}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Phone
              </dt>

              <dd className="mt-1 text-sm text-slate-900">
                {customer.phone}
              </dd>
            </div>
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
            <div>
              <dt className="text-sm font-medium text-slate-500">
                Company
              </dt>

              <dd className="mt-1 text-sm font-medium text-slate-900">
                {customer.company}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Status
              </dt>

              <dd className="mt-2">
                <span
                  className={[
                    "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                    customer.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : customer.status === "Pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600",
                  ].join(" ")}
                >
                  {customer.status}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Customer Since
              </dt>

              <dd className="mt-1 text-sm text-slate-900">
                {customer.createdAt}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </section>
  );
}