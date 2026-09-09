import {
  ConflictError,
  UnauthorizedError,
} from "../errors/app.error.js";

import {
  createUserRecord,
  findUserByEmail,
} from "../repositories/user.repository.js";

import {
  hashPassword,
  verifyPassword,
} from "../lib/password.js";

import {
  createAccessToken,
} from "../lib/jwt.js";

export interface RegisterUserInput {
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  createdAt: string;
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
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

export const loginUser = async (
  input: LoginUserInput,
): Promise<LoginResult> => {
  const normalizedEmail = input.email
    .trim()
    .toLowerCase();

  const user =
    await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new UnauthorizedError(
      "Invalid email or password",
    );
  }

  const passwordMatches =
    await verifyPassword(
      input.password,
      user.passwordHash,
    );

  if (!passwordMatches) {
    throw new UnauthorizedError(
      "Invalid email or password",
    );
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
      .toISOString()
      .slice(0, 10),
  };

  const accessToken =
    createAccessToken({
      userId: user.id,
      email: user.email,
    });

  return {
    user: authUser,
    accessToken,
  };
};