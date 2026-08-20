interface CustomerDetailFieldProps {
  label: string;
  value: string;
}

export default function CustomerDetailField({
  label,
  value,
}: CustomerDetailFieldProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-slate-500">
        {label}
      </dt>

      <dd className="mt-1 text-sm font-medium text-slate-900">
        {value}
      </dd>
    </div>
  );
}