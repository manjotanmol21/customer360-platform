import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
} from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      id,
      error,
      helperText,
      fullWidth = true,
      disabled,
      className = "",
      "aria-describedby": ariaDescribedBy,
      ...inputProps
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const errorId = `${inputId}-error`;
    const helperTextId = `${inputId}-helper`;

    const describedBy =
      ariaDescribedBy ??
      (error
        ? errorId
        : helperText
          ? helperTextId
          : undefined);

    const inputClasses = [
      "rounded-lg border bg-white px-4 py-3 text-sm text-slate-900",
      "outline-none transition placeholder:text-slate-400",
      "focus:ring-4",
      "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
      error
        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
        : "border-slate-300 focus:border-blue-600 focus:ring-blue-100",
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={fullWidth ? "w-full" : ""}>
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={inputClasses}
          {...inputProps}
        />

        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={helperTextId}
            className="mt-1.5 text-sm text-slate-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

export default Input;