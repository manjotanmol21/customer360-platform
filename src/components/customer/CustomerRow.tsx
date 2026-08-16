import { useNavigate } from "react-router-dom";

import type { Customer } from "../../features/customers/types/customer";

interface CustomerRowProps {
  customer: Customer;
}

export default function CustomerRow({
  customer,
}: CustomerRowProps) {
  const navigate = useNavigate();

  function handleRowClick() {
    navigate(`/customers/${customer.id}`);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTableRowElement>,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleRowClick();
    }
  }

  const statusClasses = [
    "inline-flex rounded-full px-3 py-1 text-xs font-medium",
    customer.status === "Active"
      ? "bg-green-100 text-green-700"
      : customer.status === "Pending"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-600",
  ].join(" ");

  return (
    <tr
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={`Open ${customer.firstName} ${customer.lastName}`}
      className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 last:border-b-0"
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
        <span className={statusClasses}>
          {customer.status}
        </span>
      </td>

      <td className="px-4 py-4 text-sm text-slate-600">
        {customer.createdAt}
      </td>
    </tr>
  );
}