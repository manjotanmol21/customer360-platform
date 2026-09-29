import {
  randomUUID,
} from "node:crypto";

import type {
  RequestHandler,
} from "express";

import {
  logger,
} from "../lib/logger.js";

export const requestObservabilityMiddleware:
RequestHandler = (
  req,
  res,
  next,
) => {
  const requestId =
    randomUUID();

  const method =
    req.method;

  const path =
    req.path;

  const startedAt =
    process.hrtime.bigint();

  res.locals.requestId =
    requestId;

  res.setHeader(
    "X-Request-ID",
    requestId,
  );

  res.once(
    "finish",
    () => {
      const completedAt =
        process.hrtime.bigint();

      const durationMs =
        Number(
          completedAt - startedAt,
        ) / 1_000_000;

      logger.info(
        "http_request_completed",
        {
          requestId,
          method,
          path,
          statusCode:
            res.statusCode,
          durationMs:
            Number(
              durationMs.toFixed(2),
            ),
        },
      );
    },
  );

  next();
};