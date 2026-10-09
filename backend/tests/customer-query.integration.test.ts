import request from "supertest";

import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import app from "../src/app.js";

import {
  CustomerStatus,
} from "../src/generated/prisma/enums.js";

import {
  prisma,
} from "../src/lib/prisma.js";

import {
  createTestUser,
  loginAndGetAccessToken,
} from "./helpers/auth.helper.js";

const viewerEmail =
  "query-viewer@test.customer360.com";

let accessToken: string;

const authorizationHeader = () => {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const createCustomerFixtures = async () => {
  await prisma.customer.createMany({
    data: [
      {
        firstName: "Aroha",
        lastName: "Young",
        email: "aroha@northstar.example",
        phone: "021-100-0001",
        company: "Northstar Aviation",
        status: CustomerStatus.ACTIVE,
        createdAt:
          new Date("2026-01-05T00:00:00.000Z"),
      },
      {
        firstName: "Ben",
        lastName: "Baker",
        email: "ben@apex.example",
        phone: "021-100-0002",
        company: "Apex Systems",
        status: CustomerStatus.PENDING,
        createdAt:
          new Date("2026-02-05T00:00:00.000Z"),
      },
      {
        firstName: "Chloe",
        lastName: "Evans",
        email: "chloe@zenith.example",
        phone: "021-100-0003",
        company: "Zenith Labs",
        status: CustomerStatus.INACTIVE,
        createdAt:
          new Date("2026-03-05T00:00:00.000Z"),
      },
      {
        firstName: "Dev",
        lastName: "Clark",
        email: "dev@horizon.example",
        phone: "021-100-0004",
        company: "Horizon Digital",
        status: CustomerStatus.ACTIVE,
        createdAt:
          new Date("2026-04-05T00:00:00.000Z"),
      },
      {
        firstName: "Ella",
        lastName: "Mason",
        email: "ella@meridian.example",
        phone: "021-100-0005",
        company: "Meridian Works",
        status: CustomerStatus.PENDING,
        createdAt:
          new Date("2026-05-05T00:00:00.000Z"),
      },
    ],
  });
};

beforeEach(async () => {
  await createTestUser({
    email: viewerEmail,
  });

  accessToken =
    await loginAndGetAccessToken(
      viewerEmail,
    );

  await createCustomerFixtures();
});

describe("GET /api/customers query experience", () => {
  it("returns default pagination metadata", async () => {
    const response = await request(app)
      .get("/api/customers")
      .set(authorizationHeader())
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(5);

    expect(response.body.pagination).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 5,
      totalPages: 1,
    });
  });

  it("returns the requested page and page size", async () => {
    const response = await request(app)
      .get("/api/customers")
      .query({
        page: 2,
        pageSize: 2,
        sortBy: "lastName",
        sortOrder: "asc",
      })
      .set(authorizationHeader())
      .expect(200);

    expect(
      response.body.data.map(
        (customer: {
          lastName: string;
        }) => customer.lastName,
      ),
    ).toEqual([
      "Evans",
      "Mason",
    ]);

    expect(response.body.pagination).toEqual({
      page: 2,
      pageSize: 2,
      totalItems: 5,
      totalPages: 3,
    });
  });

  it("searches across customer text fields", async () => {
    const response = await request(app)
      .get("/api/customers")
      .query({
        search: "northstar",
      })
      .set(authorizationHeader())
      .expect(200);

    expect(response.body.data).toHaveLength(1);

    expect(response.body.data[0]).toMatchObject({
      firstName: "Aroha",
      company: "Northstar Aviation",
    });

    expect(
      response.body.pagination.totalItems,
    ).toBe(1);
  });

  it("filters customers by status", async () => {
    const response = await request(app)
      .get("/api/customers")
      .query({
        status: "Pending",
      })
      .set(authorizationHeader())
      .expect(200);

    expect(response.body.data).toHaveLength(2);

    expect(
      response.body.data.every(
        (customer: {
          status: string;
        }) => {
          return customer.status === "Pending";
        },
      ),
    ).toBe(true);

    expect(
      response.body.pagination.totalItems,
    ).toBe(2);
  });

  it("sorts customers in descending order", async () => {
    const response = await request(app)
      .get("/api/customers")
      .query({
        sortBy: "company",
        sortOrder: "desc",
      })
      .set(authorizationHeader())
      .expect(200);

    expect(
      response.body.data.map(
        (customer: {
          company: string;
        }) => customer.company,
      ),
    ).toEqual([
      "Zenith Labs",
      "Northstar Aviation",
      "Meridian Works",
      "Horizon Digital",
      "Apex Systems",
    ]);
  });

  it("rejects an invalid page number", async () => {
    const response = await request(app)
      .get("/api/customers")
      .query({
        page: 0,
      })
      .set(authorizationHeader())
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message:
        "Page must be a positive integer",
    });
  });

  it("rejects an unsupported status", async () => {
    const response = await request(app)
      .get("/api/customers")
      .query({
        status: "Archived",
      })
      .set(authorizationHeader())
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toEqual(
      expect.any(String),
    );
  });

  it("rejects an unsupported sort field", async () => {
    const response = await request(app)
      .get("/api/customers")
      .query({
        sortBy: "passwordHash",
      })
      .set(authorizationHeader())
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toEqual(
      expect.any(String),
    );
  });
});