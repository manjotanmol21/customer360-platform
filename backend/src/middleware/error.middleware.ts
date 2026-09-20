import type {
  ErrorRequestHandler,
} from "express";

import {
  env,
} from "../config/env.js";

import {
  AppError,
} from "../errors/app.error.js";

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
    next,
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

    if (env.isProduction) {
      console.error(
        "Unexpected application error",
        {
          name:
            error instanceof Error
              ? error.name
              : "UnknownError",
        },
      );
    } else {
      console.error(
        "Unexpected application error:",
        error,
      );
    }

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  };