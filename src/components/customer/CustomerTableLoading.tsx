export default function CustomerTableLoading() {
  return (
    <div
      className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

      <p className="mt-4 text-sm font-medium text-slate-700">
        Loading customers...
      </p>
    </div>
  );
}