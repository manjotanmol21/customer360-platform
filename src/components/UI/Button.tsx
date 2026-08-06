import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import Spinner from "./Spinner";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost";

type ButtonSize =
  | "small"
  | "medium"
  | "large";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-200 disabled:bg-blue-400",

  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200 disabled:bg-slate-100 disabled:text-slate-400",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 disabled:bg-red-300",

  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-200 disabled:text-slate-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  small: "px-3 py-2 text-sm",
  medium: "px-4 py-2.5 text-sm",
  large: "px-5 py-3 text-base",
};

const spinnerSizeByButtonSize: Record<
  ButtonSize,
  "small" | "medium"
> = {
  small: "small",
  medium: "small",
  large: "medium",
};

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  isLoading = false,
  loadingText = "Loading...",
  fullWidth = false,
  disabled,
  className = "",
  type = "button",
  ...buttonProps
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const buttonClasses = [
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold shadow-sm transition",
    "focus:outline-none focus:ring-4",
    "disabled:cursor-not-allowed",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={buttonClasses}
      aria-busy={isLoading}
      {...buttonProps}
    >
      {isLoading && (
        <Spinner
          size={spinnerSizeByButtonSize[size]}
          label={loadingText}
          aria-hidden="true"
        />
      )}

      <span>
        {isLoading ? loadingText : children}
      </span>
    </button>
  );
}