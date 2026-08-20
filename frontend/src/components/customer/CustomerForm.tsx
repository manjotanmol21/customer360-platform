import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  customerSchema,
  type CustomerFormValues,
} from "../../features/customers/schemas/customerSchema";

import Button from "../UI/Button";
import Input from "../UI/Input";
import Label from "../UI/Label";

interface CustomerFormProps {
  defaultValues: CustomerFormValues;
  submitLabel: string;
  loadingText: string;

  onSubmit: (
    formData: CustomerFormValues,
  ) => Promise<void>;

  onCancel: () => void;
}

export default function CustomerForm({
  defaultValues,
  submitLabel,
  loadingText,
  onSubmit,
  onCancel,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  function handleCancel() {
    if (isDirty) {
      const shouldLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );

      if (!shouldLeave) {
        return;
      }
    }

    onCancel();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="firstName"
            required
            className="mb-2"
          >
            First name
          </Label>

          <Input
            id="firstName"
            type="text"
            autoComplete="given-name"
            disabled={isSubmitting}
            error={errors.firstName?.message}
            {...register("firstName")}
          />
        </div>

        <div>
          <Label
            htmlFor="lastName"
            required
            className="mb-2"
          >
            Last name
          </Label>

          <Input
            id="lastName"
            type="text"
            autoComplete="family-name"
            disabled={isSubmitting}
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

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
            disabled={isSubmitting}
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div>
          <Label
            htmlFor="phone"
            required
            className="mb-2"
          >
            Phone
          </Label>

          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            disabled={isSubmitting}
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <div>
          <Label
            htmlFor="company"
            required
            className="mb-2"
          >
            Company
          </Label>

          <Input
            id="company"
            type="text"
            autoComplete="organization"
            disabled={isSubmitting}
            error={errors.company?.message}
            {...register("company")}
          />
        </div>

        <div>
          <Label
            htmlFor="status"
            required
            className="mb-2"
          >
            Status
          </Label>

          <select
            id="status"
            disabled={isSubmitting}
            className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            {...register("status")}
          >
            <option value="Active">
              Active
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>

          {errors.status?.message && (
            <p className="mt-2 text-sm text-red-600">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-6">
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting}
          onClick={handleCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText={loadingText}
          disabled={!isDirty}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}