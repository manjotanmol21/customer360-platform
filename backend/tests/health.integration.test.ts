import request from "supertest";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import app from "../src/app.js";

import {
  prisma,
} from "../src/lib/prisma.js";

describe("health endpoints", () => {
  describe("GET /api/health", () => {
    it("preserves the original health response", async () => {
      const response = await request(app)
        .get("/api/health")
        .expect(200);

      expect(response.body).toEqual({
        status: "ok",
        message:
          "Customer360 API is running",
      });

      expect(
        response.headers[
          "cache-control"
        ],
      ).toBe("no-store");
    });
  });

  describe("GET /api/health/live", () => {
    it("reports that the API process is alive", async () => {
      const response = await request(app)
        .get("/api/health/live")
        .expect(200);

      expect(response.body).toEqual({
        status: "ok",
        message:
          "Customer360 API is alive",
        checks: {
          api: "up",
        },
      });

      expect(
        response.headers[
          "cache-control"
        ],
      ).toBe("no-store");
    });
  });

  describe("GET /api/health/ready", () => {
    it("reports readiness when PostgreSQL is available", async () => {
      const response = await request(app)
        .get("/api/health/ready")
        .expect(200);

      expect(response.body).toEqual({
        status: "ok",
        message:
          "Customer360 API is ready",
        checks: {
          database: "up",
        },
      });

      expect(
        response.headers[
          "cache-control"
        ],
      ).toBe("no-store");
    });

    it("returns 503 without exposing database errors", async () => {
      vi.spyOn(
        prisma,
        "$queryRaw",
      ).mockRejectedValueOnce(
        new Error(
          "Database password is secret",
        ),
      );

      const response = await request(app)
        .get("/api/health/ready")
        .expect(503);

      expect(response.body).toEqual({
        status: "unavailable",
        message:
          "Customer360 API is not ready",
        checks: {
          database: "down",
        },
      });

      expect(response.text).not.toContain(
        "Database password is secret",
      );

      expect(
        response.headers[
          "cache-control"
        ],
      ).toBe("no-store");
    });
  });
});