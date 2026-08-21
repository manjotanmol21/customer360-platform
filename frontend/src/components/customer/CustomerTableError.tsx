interface CustomerTableErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function CustomerTableError({
  message = "We could not load the customer list.",
  onRetry,
}: CustomerTableErrorProps) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center"
      role="alert"
    >
      <h3 className="text-lg font-semibold text-red-800">
        Unable to load customers
      </h3>

      <p className="mt-2 text-sm text-red-700">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Try again
        </button>
      )}
    </div>
  );
}