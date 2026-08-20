import { z } from "zod";

export const customerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required."),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required."),

  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required."),

  company: z
    .string()
    .trim()
    .min(1, "Company is required."),

  status: z.enum([
    "Active",
    "Pending",
    "Inactive",
  ]),
});

export type CustomerFormValues =
  z.infer<typeof customerSchema>;