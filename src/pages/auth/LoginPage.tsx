import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));

    setLoginError("");
  }

  function validateForm() {
    const errors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!formData.email.includes("@")) {
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

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setLoginError("");

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 800);
      });

      const normalizedEmail = formData.email.trim().toLowerCase();

      const isValidLogin =
        normalizedEmail === "admin@customer360.com" &&
        formData.password === "Password123!";

      if (!isValidLogin) {
        setLoginError("The email address or password is incorrect.");
        return;
      }

      sessionStorage.setItem("customer360_authenticated", "true");

      navigate("/dashboard", {
        replace: true,
      });
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-700">
            Customer360 Platform
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Sign in
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Enter your account details to continue.
          </p>
        </div>

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
                placeholder="you@company.com"
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                  formErrors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
                }`}
              />

              {formErrors.email && (
                <p className="mt-1.5 text-sm text-red-600">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-900"
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
                placeholder="Enter your password"
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                  formErrors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
                }`}
              />

              {formErrors.password && (
                <p className="mt-1.5 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-8 rounded-lg bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-950">
            Demo login
          </p>

          <p className="mt-2 text-sm text-blue-900">
            Email: admin@customer360.com
          </p>

          <p className="mt-1 text-sm text-blue-900">
            Password: Password123!
          </p>
        </div>
      </section>
    </main>
  );
}