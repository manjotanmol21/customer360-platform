import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/auth/PasswordInput";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Label from "../../components/UI/Label";
import { useAuth } from "../../context/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const DEMO_EMAIL = "admin@customer360.com";
const DEMO_PASSWORD = "Password123!";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    if (name === "email" || name === "password") {
      setFormErrors((currentErrors) => ({
        ...currentErrors,
        [name]: undefined,
      }));
    }

    setLoginError("");
  }

  function validateForm(): LoginFormErrors {
    const errors: LoginFormErrors = {};
    const normalizedEmail = formData.email.trim();

    if (!normalizedEmail) {
      errors.email = "Email address is required.";
    } else if (!normalizedEmail.includes("@")) {
      errors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must contain at least 8 characters.";
    }

    return errors;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    setLoginError("");
    setIsSubmitting(true);

    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 800);
      });

      const normalizedEmail =
        formData.email.trim().toLowerCase();

      const credentialsAreValid =
        normalizedEmail === DEMO_EMAIL &&
        formData.password === DEMO_PASSWORD;

      if (!credentialsAreValid) {
        setLoginError(
          "The email address or password is incorrect. Please try again.",
        );
        return;
      }

      login();

      navigate("/dashboard", {
        replace: true,
      });
    } catch {
      setLoginError(
        "We could not sign you in. Please try again in a few moments.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <Card
        padding="large"
        shadow="medium"
        className="w-full max-w-md"
      >
        <header className="mb-8">
          <p className="text-sm font-semibold text-blue-700">
            Customer360 Platform
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Sign in
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Enter your account details to continue to the dashboard.
          </p>
        </header>

        {loginError && (
          <div
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5">
            <div>
              <Label
                htmlFor="email"
                required
                className="mb-2"
              >
                Email address
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                autoComplete="email"
                autoFocus
                placeholder="you@company.com"
                error={formErrors.email}
              />
            </div>

            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isSubmitting}
              error={formErrors.password}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              size="large"
              isLoading={isSubmitting}
              loadingText="Signing in..."
            >
              Sign in
            </Button>
          </div>
        </form>

        <aside className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-950">
            Demo account
          </p>

          <p className="mt-2 text-sm text-blue-900">
            Email:{" "}
            <span className="font-medium">
              admin@customer360.com
            </span>
          </p>

          <p className="mt-1 text-sm text-blue-900">
            Password:{" "}
            <span className="font-medium">
              Password123!
            </span>
          </p>
        </aside>
      </Card>
    </main>
  );
}