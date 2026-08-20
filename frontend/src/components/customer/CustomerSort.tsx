export type CustomerSortValue =
  | "name"
  | "company"
  | "created";

interface CustomerSortProps {
  value: CustomerSortValue;
  onChange: (value: CustomerSortValue) => void;
}

const options: {
  label: string;
  value: CustomerSortValue;
}[] = [
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Company",
    value: "company",
  },
  {
    label: "Created Date",
    value: "created",
  },
];

export default function CustomerSort({
  value,
  onChange,
}: CustomerSortProps) {
  return (
    <div>
      <label
        htmlFor="customer-sort"
        className="sr-only"
      >
        Sort customers
      </label>

      <select
        id="customer-sort"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value as CustomerSortValue,
          )
        }
        className="h-12 min-w-[170px] rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            Sort: {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}