import { zodResolver } from "@hookform/resolvers/zod";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Label from "../../components/UI/Label";

import { customers } from "../../features/customers/data/customers";

import {
  customerSchema,
  type CustomerFormValues,
} from "../../features/customers/schemas/customerSchema";

export default function CustomerEditPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const customer = customers.find(
    (item) => item.id === Number(customerId),
  );

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

    values: customer
      ? {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          status: customer.status,
        }
      : undefined,
  });

  if (!customer) {
    return (
      <section>
        <Card
          padding="large"
          shadow="small"
        >
          <h1 className="text-2xl font-bold text-slate-950">
            Customer not found
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            The customer you are trying to edit does not exist.
          </p>

          <Link
            to="/customers"
            className="mt-6 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            ← Back to customers
          </Link>
        </Card>
      </section>
    );
  }

  const selectedCustomer = customer;

  async function onSubmit(
    formData: CustomerFormValues,
  ) {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 700);
    });

    console.log(
      "Updated customer:",
      formData,
    );

    alert(
      `Changes saved for ${formData.firstName} ${formData.lastName}.`,
    );

    navigate(
      `/customers/${selectedCustomer.id}`,
      {
        replace: true,
      },
    );
  }

  function handleCancel() {
    if (isDirty) {
      const shouldLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );

      if (!shouldLeave) {
        return;
      }
    }

    navigate(
      `/customers/${selectedCustomer.id}`,
    );
  }

  return (
    <section>
      <div className="mb-8">
        <Link
          to={`/customers/${selectedCustomer.id}`}
          className="text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          ← Back to customer
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          Edit Customer
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Update the customer profile and account information.
        </p>
      </div>

      <Card
        padding="large"
        shadow="small"
        className="max-w-3xl"
      >
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
              loadingText="Saving..."
              disabled={!isDirty}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}