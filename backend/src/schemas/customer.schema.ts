import { z } from "zod";

export const customerStatusSchema = z.enum([
  "Active",
  "Pending",
  "Inactive",
]);

export const customerSortFieldSchema = z.enum([
  "id",
  "firstName",
  "lastName",
  "email",
  "company",
  "status",
  "createdAt",
]);

export const customerSortOrderSchema = z.enum([
  "asc",
  "desc",
]);

export const customerQuerySchema = z.object({
  page: z.coerce
    .number({
      error:
        "Page must be a positive integer",
    })
    .int(
      "Page must be a positive integer",
    )
    .min(
      1,
      "Page must be a positive integer",
    )
    .default(1),

  pageSize: z.coerce
    .number({
      error:
        "Page size must be an integer between 1 and 100",
    })
    .int(
      "Page size must be an integer between 1 and 100",
    )
    .min(
      1,
      "Page size must be an integer between 1 and 100",
    )
    .max(
      100,
      "Page size must be an integer between 1 and 100",
    )
    .default(10),

  search: z
    .string()
    .trim()
    .max(
      100,
      "Search must be 100 characters or fewer",
    )
    .optional()
    .transform((value) => {
      return value || undefined;
    }),

  status:
    customerStatusSchema.optional(),

  sortBy:
    customerSortFieldSchema.default("id"),

  sortOrder:
    customerSortOrderSchema.default("asc"),
});

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

export type CustomerQueryInput =
  z.infer<typeof customerQuerySchema>;

export type CustomerBodyInput =
  z.infer<typeof customerBodySchema>;