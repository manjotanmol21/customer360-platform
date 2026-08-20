import type {
  HTMLAttributes,
} from "react";

type SpinnerSize =
  | "small"
  | "medium"
  | "large";

interface SpinnerProps
  extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  small: "h-4 w-4 border-2",
  medium: "h-5 w-5 border-2",
  large: "h-8 w-8 border-4",
};

export default function Spinner({
  size = "medium",
  label = "Loading",
  className = "",
  ...spinnerProps
}: SpinnerProps) {
  const spinnerClasses = [
    "inline-block animate-spin rounded-full",
    "border-current border-r-transparent",
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={spinnerClasses}
      role="status"
      aria-label={label}
      {...spinnerProps}
    >
      <span className="sr-only">
        {label}
      </span>
    </span>
  );
}