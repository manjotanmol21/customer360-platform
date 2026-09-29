import type {
  ErrorRequestHandler,
} from "express";

import {
  env,
} from "../config/env.js";

import {
  AppError,
} from "../errors/app.error.js";

import {
  logger,
} from "../lib/logger.js";

interface HttpParserError
  extends Error {
  status?: number;
  type?: string;
}

const isHttpParserError = (
  error: unknown,
): error is HttpParserError => {
  return error instanceof Error;
};

export const errorHandler:
ErrorRequestHandler = (
  error,
  req,
  res,
  _next,
) => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({
        success: false,
        message: error.message,
      });

    return;
  }

  if (
    isHttpParserError(error) &&
    error.status === 413
  ) {
    res.status(413).json({
      success: false,
      message:
        "Request body is too large",
    });

    return;
  }

  if (
    isHttpParserError(error) &&
    error.status === 400 &&
    error instanceof SyntaxError
  ) {
    res.status(400).json({
      success: false,
      message:
        "Request body contains invalid JSON",
    });

    return;
  }

  const errorDetails =
    error instanceof Error
      ? {
          name: error.name,
          ...(
            env.isProduction
              ? {}
              : {
                  message:
                    error.message,
                  stack:
                    error.stack,
                }
          ),
        }
      : {
          name: "UnknownError",
        };

  logger.error(
    "unexpected_application_error",
    {
      requestId:
        res.locals.requestId,
      method: req.method,
      path: req.path,
      ...errorDetails,
    },
  );

  res.status(500).json({
    success: false,
    message:
      "Internal server error",
  });
};