import type {
  CustomerStatusFilterValue,
} from "./CustomerStatusFilter";

interface CustomerEmptyStateProps {
  searchTerm: string;
  statusFilter: CustomerStatusFilterValue;
}

export default function CustomerEmptyState({
  searchTerm,
  statusFilter,
}: CustomerEmptyStateProps) {
  const normalizedSearchTerm =
    searchTerm.trim();

  const hasSearch =
    normalizedSearchTerm.length > 0;

  const hasStatusFilter =
    statusFilter !== "All";

  let message =
    "No customers have been added yet.";

  if (hasSearch && hasStatusFilter) {
    message =
      `No ${statusFilter.toLowerCase()} customers match "${normalizedSearchTerm}". ` +
      "Try changing the search or status filter.";
  } else if (hasSearch) {
    message =
      `No customers match "${normalizedSearchTerm}". ` +
      "Try a different search term.";
  } else if (hasStatusFilter) {
    message =
      `No ${statusFilter.toLowerCase()} customers were found. ` +
      "Try a different status filter.";
  }

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-slate-900">
        No customers found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {message}
      </p>
    </div>
  );
}