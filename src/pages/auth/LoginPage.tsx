import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
  const [showPassword, setShowPassword] = useState(false);

  // A logged-in user should not be able to return to the login page.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      // Simulates a backend request.
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 800);
      });

      const normalizedEmail = formData.email.trim().toLowerCase();

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

  function handlePasswordVisibility() {
    setShowPassword((currentValue) => !currentValue);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
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
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                autoComplete="email"
                autoFocus
                aria-invalid={Boolean(formErrors.email)}
                aria-describedby={
                  formErrors.email ? "email-error" : undefined
                }
                placeholder="you@company.com"
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100 ${
                  formErrors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
                }`}
              />

              {formErrors.email && (
                <p
                  id="email-error"
                  className="mt-1.5 text-sm text-red-600"
                  role="alert"
                >
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={handlePasswordVisibility}
                  disabled={isSubmitting}
                  className="text-sm font-semibold text-blue-700 transition hover:text-blue-900 disabled:cursor-not-allowed disabled:text-slate-400"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                autoComplete="current-password"
                aria-invalid={Boolean(formErrors.password)}
                aria-describedby={
                  formErrors.password ? "password-error" : undefined
                }
                placeholder="Enter your password"
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100 ${
                  formErrors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
                }`}
              />

              {formErrors.password && (
                <p
                  id="password-error"
                  className="mt-1.5 text-sm text-red-600"
                  role="alert"
                >
                  {formErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
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
      </section>
    </main>
  );
}