import request from "supertest";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import app from "../src/app.js";

import {
  logger,
} from "../src/lib/logger.js";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("request observability", () => {
  it("adds a server-generated request ID and structured completion log", async () => {
    const consoleLogSpy =
      vi.spyOn(
        console,
        "log",
      ).mockImplementation(
        () => undefined,
      );

    const response =
      await request(app)
        .get("/api/health/live")
        .expect(200);

    const requestId =
      response.headers[
        "x-request-id"
      ];

    expect(requestId).toEqual(
      expect.any(String),
    );

    expect(requestId).toMatch(
      uuidPattern,
    );

    expect(
      consoleLogSpy,
    ).toHaveBeenCalledTimes(1);

    const serializedLog =
      consoleLogSpy.mock.calls[0]?.[0];

    expect(
      serializedLog,
    ).toEqual(
      expect.any(String),
    );

    const logEntry =
      JSON.parse(
        String(serializedLog),
      );

    expect(logEntry).toMatchObject({
      level: "info",
      event:
        "http_request_completed",
      requestId,
      method: "GET",
      path: "/api/health/live",
      statusCode: 200,
    });

    expect(
      logEntry.timestamp,
    ).toEqual(expect.any(String));

    expect(
      logEntry.durationMs,
    ).toEqual(expect.any(Number));
  });

  it("does not trust a caller-supplied request ID", async () => {
    vi.spyOn(
      console,
      "log",
    ).mockImplementation(
      () => undefined,
    );

    const response =
      await request(app)
        .get("/api/health/live")
        .set(
          "X-Request-ID",
          "attacker-controlled-value",
        )
        .expect(200);

    const requestId =
      response.headers[
        "x-request-id"
      ];

    expect(requestId).not.toBe(
      "attacker-controlled-value",
    );

    expect(requestId).toMatch(
      uuidPattern,
    );
  });

  it("writes structured error logs", () => {
    const consoleErrorSpy =
      vi.spyOn(
        console,
        "error",
      ).mockImplementation(
        () => undefined,
      );

    logger.error(
      "test_error",
      {
        requestId:
          "test-request-id",
      },
    );

    expect(
      consoleErrorSpy,
    ).toHaveBeenCalledTimes(1);

    const serializedLog =
      consoleErrorSpy
        .mock.calls[0]?.[0];

    const logEntry =
      JSON.parse(
        String(serializedLog),
      );

    expect(logEntry).toMatchObject({
      level: "error",
      event: "test_error",
      requestId:
        "test-request-id",
    });

    expect(
      logEntry.timestamp,
    ).toEqual(expect.any(String));
  });
});