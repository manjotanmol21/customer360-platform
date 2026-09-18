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
  prisma,
} from "../src/lib/prisma.js";

import {
  createTestUser,
  loginAndGetAccessToken,
} from "./helpers/auth.helper.js";

const createCustomerPayload = {
  firstName: "Test",
  lastName: "Customer",
  email: "test.customer@example.com",
  phone: "0210000000",
  company: "Customer360 Test Company",
  status: "Active",
};

const updateCustomerPayload = {
  firstName: "Updated",
  lastName: "Customer",
  email: "updated.customer@example.com",
  phone: "0220000000",
  company: "Updated Test Company",
  status: "Pending",
};

async function createCustomerFixture() {
  return prisma.customer.create({
    data: {
      firstName: "Existing",
      lastName: "Customer",
      email:
        "existing.customer@example.com",
      phone: "0230000000",
      company:
        "Existing Test Company",
    },
  });
}

describe("VIEWER customer authorization", () => {
  it("allows a VIEWER to read customers", async () => {
    await createTestUser({
      email:
        "viewer@test.customer360.com",
      role: UserRole.VIEWER,
    });

    const customer =
      await createCustomerFixture();

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

    expect(response.body.success).toBe(
      true,
    );

    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: customer.id,
          email:
            "existing.customer@example.com",
        }),
      ]),
    );
  });

  it("returns 403 when a VIEWER attempts to create a customer", async () => {
    await createTestUser({
      email:
        "viewer@test.customer360.com",
      role: UserRole.VIEWER,
    });

    const accessToken =
      await loginAndGetAccessToken(
        "viewer@test.customer360.com",
      );

    const response = await request(app)
      .post("/api/customers")
      .set(
        "Authorization",
        `Bearer ${accessToken}`,
      )
      .send(createCustomerPayload)
      .expect(403);

    expect(response.body).toEqual({
      success: false,
      message:
        "You do not have permission to perform this action",
    });

    expect(
      await prisma.customer.count(),
    ).toBe(0);
  });

  it("returns 403 when a VIEWER attempts to update a customer", async () => {
    await createTestUser({
      email:
        "viewer@test.customer360.com",
      role: UserRole.VIEWER,
    });

    const customer =
      await createCustomerFixture();

    const accessToken =
      await loginAndGetAccessToken(
        "viewer@test.customer360.com",
      );

    const response = await request(app)
      .put(
        `/api/customers/${customer.id}`,
      )
      .set(
        "Authorization",
        `Bearer ${accessToken}`,
      )
      .send(updateCustomerPayload)
      .expect(403);

    expect(response.body).toEqual({
      success: false,
      message:
        "You do not have permission to perform this action",
    });

    const unchangedCustomer =
      await prisma.customer.findUnique({
        where: {
          id: customer.id,
        },
      });

    expect(
      unchangedCustomer?.firstName,
    ).toBe("Existing");
  });

  it("returns 403 when a VIEWER attempts to delete a customer", async () => {
    await createTestUser({
      email:
        "viewer@test.customer360.com",
      role: UserRole.VIEWER,
    });

    const customer =
      await createCustomerFixture();

    const accessToken =
      await loginAndGetAccessToken(
        "viewer@test.customer360.com",
      );

    const response = await request(app)
      .delete(
        `/api/customers/${customer.id}`,
      )
      .set(
        "Authorization",
        `Bearer ${accessToken}`,
      )
      .expect(403);

    expect(response.body).toEqual({
      success: false,
      message:
        "You do not have permission to perform this action",
    });

    const retainedCustomer =
      await prisma.customer.findUnique({
        where: {
          id: customer.id,
        },
      });

    expect(retainedCustomer).not.toBeNull();
  });
});

describe("ADMIN customer authorization", () => {
  it("allows an ADMIN to create, update and delete a customer", async () => {
    await createTestUser({
      email:
        "admin@test.customer360.com",
      role: UserRole.ADMIN,
    });

    const accessToken =
      await loginAndGetAccessToken(
        "admin@test.customer360.com",
      );

    const createResponse =
      await request(app)
        .post("/api/customers")
        .set(
          "Authorization",
          `Bearer ${accessToken}`,
        )
        .send(createCustomerPayload)
        .expect(201);

    expect(createResponse.body).toMatchObject({
      success: true,
      data: {
        firstName: "Test",
        lastName: "Customer",
        email:
          "test.customer@example.com",
      },
    });

    const customerId =
      createResponse.body.data.id;

    expect(customerId).toEqual(
      expect.any(Number),
    );

    const updateResponse =
      await request(app)
        .put(
          `/api/customers/${customerId}`,
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`,
        )
        .send(updateCustomerPayload)
        .expect(200);

    expect(updateResponse.body).toMatchObject({
      success: true,
      data: {
        id: customerId,
        firstName: "Updated",
        email:
          "updated.customer@example.com",
      },
    });

    await request(app)
      .delete(
        `/api/customers/${customerId}`,
      )
      .set(
        "Authorization",
        `Bearer ${accessToken}`,
      )
      .expect(204);

    const deletedCustomer =
      await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });

    expect(deletedCustomer).toBeNull();
  });
});