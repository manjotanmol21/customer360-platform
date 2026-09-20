import request from "supertest";

import {
  describe,
  expect,
  it,
} from "vitest";

import app from "../src/app.js";

describe("security headers", () => {
  it("adds Helmet security headers and removes the Express disclosure header", async () => {
    const response = await request(app)
      .get("/api/health")
      .expect(200);

    expect(
      response.headers[
        "x-content-type-options"
      ],
    ).toBe("nosniff");

    expect(
      response.headers[
        "x-frame-options"
      ],
    ).toBe("SAMEORIGIN");

    expect(
      response.headers[
        "content-security-policy"
      ],
    ).toEqual(expect.any(String));

    expect(
      response.headers["x-powered-by"],
    ).toBeUndefined();
  });
});

describe("CORS policy", () => {
  it("allows a configured frontend origin", async () => {
    const response = await request(app)
      .get("/api/health")
      .set(
        "Origin",
        "http://localhost:5173",
      )
      .expect(200);

    expect(
      response.headers[
        "access-control-allow-origin"
      ],
    ).toBe(
      "http://localhost:5173",
    );
  });

  it("rejects an unconfigured browser origin", async () => {
    const response = await request(app)
      .get("/api/health")
      .set(
        "Origin",
        "https://untrusted.example.com",
      )
      .expect(403);

    expect(response.body).toEqual({
      success: false,
      message:
        "Origin is not allowed by CORS",
    });

    expect(
      response.headers[
        "access-control-allow-origin"
      ],
    ).toBeUndefined();
  });
});

describe("API rate-limit metadata", () => {
  it("returns modern rate-limit headers without legacy X-RateLimit headers", async () => {
    const response = await request(app)
      .get("/api/customers")
      .expect(401);

    expect(
      response.headers.ratelimit,
    ).toEqual(expect.any(String));

    expect(
      response.headers[
        "ratelimit-policy"
      ],
    ).toEqual(expect.any(String));

    expect(
      response.headers[
        "x-ratelimit-limit"
      ],
    ).toBeUndefined();
  });
});

describe("request-body protection", () => {
  it("returns 413 when the JSON request body exceeds the configured limit", async () => {
    const oversizedPayload = {
      payload: "x".repeat(
        110 * 1024,
      ),
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(oversizedPayload)
      .expect(413);

    expect(response.body).toEqual({
      success: false,
      message:
        "Request body is too large",
    });
  });

  it("returns 400 when the request contains malformed JSON", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .set(
        "Content-Type",
        "application/json",
      )
      .send(
        '{"email":"test@example.com"',
      )
      .expect(400);

    expect(response.body).toEqual({
      success: false,
      message:
        "Request body contains invalid JSON",
    });
  });
});

describe("unknown API routes", () => {
  it("returns a consistent JSON 404 response", async () => {
    const response = await request(app)
      .get(
        "/api/route-that-does-not-exist",
      )
      .expect(404);

    expect(response.body).toEqual({
      success: false,
      message: "API route not found",
    });

    expect(
      response.headers["content-type"],
    ).toContain("application/json");
  });
});