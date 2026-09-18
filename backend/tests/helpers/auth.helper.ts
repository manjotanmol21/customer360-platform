import request from "supertest";

import app from "../../src/app.js";

import {
  UserRole,
} from "../../src/generated/prisma/enums.js";

import {
  hashPassword,
} from "../../src/lib/password.js";

import {
  prisma,
} from "../../src/lib/prisma.js";

export const TEST_PASSWORD =
  "TestPassword123!";

interface CreateTestUserInput {
  email: string;
  role?: UserRole;
  password?: string;
}

export async function createTestUser({
  email,
  role = UserRole.VIEWER,
  password = TEST_PASSWORD,
}: CreateTestUserInput) {
  const passwordHash =
    await hashPassword(password);

  return prisma.user.create({
    data: {
      email: email
        .trim()
        .toLowerCase(),
      passwordHash,
      role,
    },
  });
}

export async function loginAndGetAccessToken(
  email: string,
  password = TEST_PASSWORD,
): Promise<string> {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password,
    });

  if (response.status !== 200) {
    throw new Error(
      `Test login failed with HTTP ${response.status}: ${JSON.stringify(response.body)}`,
    );
  }

  const accessToken =
    response.body?.data?.accessToken;

  if (typeof accessToken !== "string") {
    throw new Error(
      "Login response did not contain an access token.",
    );
  }

  return accessToken;
}