import type { CustomerStatus } from "../../features/customers/types/customer";

export type CustomerStatusFilterValue =
  | "All"
  | CustomerStatus;

interface CustomerStatusFilterProps {
  value: CustomerStatusFilterValue;
  onChange: (value: CustomerStatusFilterValue) => void;
}

const filterOptions: CustomerStatusFilterValue[] = [
  "All",
  "Active",
  "Pending",
  "Inactive",
];

export default function CustomerStatusFilter({
  value,
  onChange,
}: CustomerStatusFilterProps) {
  return (
    <div>
      <label
        htmlFor="customer-status-filter"
        className="sr-only"
      >
        Filter customers by status
      </label>

      <select
        id="customer-status-filter"
        value={value}
        onChange={(event) => {
          onChange(
            event.target.value as CustomerStatusFilterValue,
          );
        }}
        className="h-12 min-w-[170px] rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {filterOptions.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}