interface CustomerPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CustomerPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CustomerPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage =
    currentPage <= 1;

  const isLastPage =
    currentPage >= totalPages;

  return (
    <nav
      aria-label="Customer pagination"
      className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        disabled={isFirstPage}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <p
        aria-live="polite"
        className="text-center text-sm font-medium text-slate-700"
      >
        Page {currentPage} of {totalPages}
      </p>

      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        disabled={isLastPage}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}