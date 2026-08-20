import Card from "../../components/UI/Card";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <Card
      padding="medium"
      shadow="small"
      className="w-full"
    >
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Overview of your Customer360 platform.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Customers"
          value="1,250"
          description="Total customers in the platform"
        />

        <StatCard
          title="Active Deals"
          value="320"
          description="Deals currently in progress"
        />

        <StatCard
          title="Revenue"
          value="$250K"
          description="Revenue generated from active customers"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Card
          padding="medium"
          shadow="small"
        >
          <h2 className="text-lg font-semibold text-slate-950">
            Recent Customers
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Recent customer activity will appear here.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="font-medium text-slate-900">
                  Acme Corporation
                </p>

                <p className="text-sm text-slate-500">
                  contact@acme.com
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="font-medium text-slate-900">
                  Northstar Limited
                </p>

                <p className="text-sm text-slate-500">
                  hello@northstar.com
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">
                  Summit Group
                </p>

                <p className="text-sm text-slate-500">
                  team@summit.com
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Pending
              </span>
            </div>
          </div>
        </Card>

        <Card
          padding="medium"
          shadow="small"
        >
          <h2 className="text-lg font-semibold text-slate-950">
            Recent Activity
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Latest platform activity will appear here.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-900">
                New customer added
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Acme Corporation was added to Customer360.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-900">
                Deal updated
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Enterprise Renewal moved to negotiation.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-900">
                Customer profile updated
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Northstar Limited contact details were updated.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}