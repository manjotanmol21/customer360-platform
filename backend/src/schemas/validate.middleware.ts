import type {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

import type { ZodType } from "zod";

import { BadRequestError } from "../errors/app.error.js";

export const validateBody = (
  schema: ZodType,
): RequestHandler => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      next(new BadRequestError(message));

      return;
    }

    req.body = result.data;

    next();
  };
};