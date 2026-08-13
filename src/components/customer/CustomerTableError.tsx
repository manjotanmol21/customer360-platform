interface CustomerTableErrorProps {
  message?: string;
}

export default function CustomerTableError({
  message = "We could not load the customer list.",
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
    </div>
  );
}