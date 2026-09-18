import request from "supertest";

import {
  describe,
  expect,
  it,
} from "vitest";

import app from "../src/app.js";

import {
  UserRole,
} from "../src/generated/prisma/enums.js";

import {
  createTestUser,
  loginAndGetAccessToken,
  TEST_PASSWORD,
} from "./helpers/auth.helper.js";

describe("POST /api/auth/login", () => {
  it("returns the authenticated user and access token for valid credentials", async () => {
    const user = await createTestUser({
      email: "viewer@test.customer360.com",
      role: UserRole.VIEWER,
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email:
          "  VIEWER@TEST.CUSTOMER360.COM  ",
        password: TEST_PASSWORD,
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        user: {
          id: user.id,
          email:
            "viewer@test.customer360.com",
          role: UserRole.VIEWER,
        },
      },
    });

    expect(
      response.body.data.accessToken,
    ).toEqual(expect.any(String));

    expect(
      response.body.data.user,
    ).not.toHaveProperty(
      "passwordHash",
    );
  });

  it("returns 401 when the password is incorrect", async () => {
    await createTestUser({
      email: "viewer@test.customer360.com",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email:
          "viewer@test.customer360.com",
        password: "IncorrectPassword!",
      })
      .expect(401);

    expect(response.body).toEqual({
      success: false,
      message:
        "Invalid email or password",
    });
  });

  it("returns the same 401 response when the email does not exist", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email:
          "unknown@test.customer360.com",
        password: TEST_PASSWORD,
      })
      .expect(401);

    expect(response.body).toEqual({
      success: false,
      message:
        "Invalid email or password",
    });
  });
});

describe("authentication middleware", () => {
  it("returns 401 when the Authorization header is missing", async () => {
    const response = await request(app)
      .get("/api/customers")
      .expect(401);

    expect(response.body).toEqual({
      success: false,
      message: "Authentication required",
    });
  });

  it("returns 401 when the Authorization header is malformed", async () => {
    const response = await request(app)
      .get("/api/customers")
      .set(
        "Authorization",
        "Token not-a-bearer-token",
      )
      .expect(401);

    expect(response.body).toEqual({
      success: false,
      message:
        "Invalid authorization header",
    });
  });

  it("returns 401 when the bearer token is invalid", async () => {
    const response = await request(app)
      .get("/api/customers")
      .set(
        "Authorization",
        "Bearer invalid-test-token",
      )
      .expect(401);

    expect(response.body).toEqual({
      success: false,
      message:
        "Invalid or expired access token",
    });
  });

  it("allows access with a valid bearer token", async () => {
    await createTestUser({
      email: "viewer@test.customer360.com",
      role: UserRole.VIEWER,
    });

    const accessToken =
      await loginAndGetAccessToken(
        "viewer@test.customer360.com",
      );

    const response = await request(app)
      .get("/api/customers")
      .set(
        "Authorization",
        `Bearer ${accessToken}`,
      )
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      data: [],
    });
  });
});