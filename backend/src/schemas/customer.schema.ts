import { z } from "zod";

export const customerStatusSchema = z.enum([
  "Active",
  "Pending",
  "Inactive",
]);

export const customerBodySchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(
      100,
      "First name must be 100 characters or fewer",
    ),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(
      100,
      "Last name must be 100 characters or fewer",
    ),

  email: z
    .string()
    .trim()
    .email("Email must be a valid email address")
    .max(
      255,
      "Email must be 255 characters or fewer",
    ),

  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .max(
      50,
      "Phone must be 50 characters or fewer",
    ),

  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(
      150,
      "Company must be 150 characters or fewer",
    ),

  status: customerStatusSchema,
});

export type CustomerBodyInput =
  z.infer<typeof customerBodySchema>;