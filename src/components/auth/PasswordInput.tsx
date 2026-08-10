import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from "react";

import Input from "../UI/Input";
import Label from "../UI/Label";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  required?: boolean;
}

const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(function PasswordInput(
  {
    id = "password",
    label = "Password",
    error,
    required = false,
    disabled,
    ...inputProps
  },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);

  function handlePasswordVisibility() {
    setShowPassword((currentValue) => !currentValue);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <Label
          htmlFor={id}
          required={required}
        >
          {label}
        </Label>

        <button
          type="button"
          onClick={handlePasswordVisibility}
          disabled={disabled}
          className="text-sm font-semibold text-blue-700 transition hover:text-blue-900 disabled:cursor-not-allowed disabled:text-slate-400"
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          aria-controls={id}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <Input
        ref={ref}
        id={id}
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        error={error}
        {...inputProps}
      />
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;