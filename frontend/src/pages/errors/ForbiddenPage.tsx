import {
  Link,
  useLocation,
} from "react-router-dom";

interface ForbiddenLocationState {
  from?: string;
}

export default function ForbiddenPage() {
  const location = useLocation();

  const state =
    location.state as
      | ForbiddenLocationState
      | null;

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-700"
          aria-hidden="true"
        >
          403
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-red-700">
          Access forbidden
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          You do not have permission to view this page
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          Your account is authenticated, but
          your current role does not allow
          access to this operation.
        </p>

        {state?.from && (
          <p className="mt-3 break-all text-xs text-slate-500">
            Requested page: {state.from}
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/customers"
            replace
            className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to customers
          </Link>

          <Link
            to="/dashboard"
            replace
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}