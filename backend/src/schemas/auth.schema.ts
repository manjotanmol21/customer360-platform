import { z } from "zod";

export const registerUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Email must be a valid email address")
    .max(
      255,
      "Email must be 255 characters or fewer",
    ),

  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters",
    )
    .max(
      128,
      "Password must be 128 characters or fewer",
    ),
});

export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Email must be a valid email address")
    .max(
      255,
      "Email must be 255 characters or fewer",
    ),

  password: z
    .string()
    .min(
      1,
      "Password is required",
    )
    .max(
      128,
      "Password must be 128 characters or fewer",
    ),
});

export type RegisterUserBody =
  z.infer<typeof registerUserSchema>;

export type LoginUserBody =
  z.infer<typeof loginUserSchema>;