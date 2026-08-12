import Card from "../../components/UI/Card";
import { customers } from "../../features/customers/data/customers";

export default function CustomersPage() {
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                  Name
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                  Company
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                  Email
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                  Phone
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                  Created
                </th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="px-4 py-4 text-sm font-medium text-slate-900">
                    {customer.firstName} {customer.lastName}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {customer.company}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {customer.email}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {customer.phone}
                  </td>

                  <td className="px-4 py-4 text-sm">
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
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {customer.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}