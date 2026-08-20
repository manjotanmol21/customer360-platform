interface CustomerSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomerSearch({
  value,
  onChange,
}: CustomerSearchProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="customer-search"
        className="sr-only"
      >
        Search customers
      </label>

      <div className="relative">
        <span
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"
          aria-hidden="true"
        >
          🔍
        </span>

        <input
          id="customer-search"
          type="search"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          placeholder="Search by name, company, email, phone or status..."
          className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>
  );
}