import type {
  LabelHTMLAttributes,
  ReactNode,
} from "react";

interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
  optionalText?: string;
}

export default function Label({
  children,
  required = false,
  optionalText,
  className = "",
  ...labelProps
}: LabelProps) {
  const labelClasses = [
    "block text-sm font-semibold text-slate-700",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label
      className={labelClasses}
      {...labelProps}
    >
      <span>{children}</span>

      {required && (
        <>
          <span
            className="ml-1 text-red-600"
            aria-hidden="true"
          >
            *
          </span>

          <span className="sr-only">
            required
          </span>
        </>
      )}

      {!required && optionalText && (
        <span className="ml-2 font-normal text-slate-500">
          {optionalText}
        </span>
      )}
    </label>
  );
}