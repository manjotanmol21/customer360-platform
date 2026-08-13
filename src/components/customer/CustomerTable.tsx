import type { Customer } from "../../features/customers/types/customer";
import CustomerRow from "./CustomerRow";

interface CustomerTableProps {
  customers: Customer[];
}

export default function CustomerTable({
  customers,
}: CustomerTableProps) {
  return (
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
            <CustomerRow
              key={customer.id}
              customer={customer}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}