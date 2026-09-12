import { useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import PasswordInput from "../../components/auth/PasswordInput";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Label from "../../components/UI/Label";

import { useAuth } from "../../context/AuthContext";

import loginSchema, {
  type LoginFormValues,
} from "../../features/auth/schemas/loginSchema";

interface LoginLocationState {
  from?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isAuthenticated,
  } = useAuth();

  const [loginError, setLoginError] =
    useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  async function onSubmit(
    formData: LoginFormValues,
  ) {
    setLoginError("");

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      const state =
        location.state as
          | LoginLocationState
          | null;

      navigate(
        state?.from ?? "/dashboard",
        {
          replace: true,
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message;

        if (
          typeof message === "string"
        ) {
          setLoginError(message);
          return;
        }
      }

      setLoginError(
        "Unable to sign in. Please try again.",
      );
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
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
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="you@company.com"
                disabled={isSubmitting}
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <PasswordInput
              id="password"
              label="Password"
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isSubmitting}
              required
              error={
                errors.password?.message
              }
              {...register("password")}
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
      </Card>
    </main>
  );
}