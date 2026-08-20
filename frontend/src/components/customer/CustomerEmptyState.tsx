interface CustomerEmptyStateProps {
  searchTerm: string;
}

export default function CustomerEmptyState({
  searchTerm,
}: CustomerEmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-slate-900">
        No customers found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        No customers match "{searchTerm}". Try a different search term.
      </p>
    </div>
  );
}