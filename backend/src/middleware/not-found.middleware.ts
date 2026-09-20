import type {
  RequestHandler,
} from "express";

import {
  NotFoundError,
} from "../errors/app.error.js";

export const notFoundHandler:
  RequestHandler = (
    req,
    res,
    next,
  ) => {
    next(
      new NotFoundError(
        "API route not found",
      ),
    );
  };