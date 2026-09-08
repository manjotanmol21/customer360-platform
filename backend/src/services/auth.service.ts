import { ConflictError } from "../errors/app.error.js";
import {
  createUserRecord,
  findUserByEmail,
} from "../repositories/user.repository.js";
import { hashPassword } from "../lib/password.js";

export interface RegisterUserInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  createdAt: string;
}

export const registerUser = async (
  input: RegisterUserInput,
): Promise<AuthUser> => {
  const normalizedEmail = input.email
    .trim()
    .toLowerCase();

  const existingUser =
    await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new ConflictError(
      "A user with this email already exists",
    );
  }

  const passwordHash =
    await hashPassword(input.password);

  const user = await createUserRecord({
    email: normalizedEmail,
    passwordHash,
  });

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
      .toISOString()
      .slice(0, 10),
  };
};