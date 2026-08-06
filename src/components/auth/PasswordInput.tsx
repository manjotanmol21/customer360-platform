import { useState } from "react";
import Input from "../UI/Input";
import Label from "../UI/Label";

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
  id,
  name,
  value,
  label = "Password",
  placeholder = "Enter your password",
  error,
  disabled = false,
  required = false,
  autoComplete = "current-password",
  onChange,
}: PasswordInputProps) {
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
            showPassword ? "Hide password" : "Show password"
          }
          aria-controls={id}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
        error={error}
      />
    </div>
  );
}