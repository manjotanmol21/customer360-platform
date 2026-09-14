import type {
  NextFunction,
  Response,
} from "express";

import {
  ForbiddenError,
  UnauthorizedError,
} from "../errors/app.error.js";

import type {
  UserRole,
} from "../generated/prisma/enums.js";

import type {
  AuthenticatedRequest,
} from "./auth.middleware.js";

export const authorize = (
  ...allowedRoles: UserRole[]
) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      throw new UnauthorizedError(
        "Authentication required",
      );
    }

    if (
      !allowedRoles.includes(
        req.user.role,
      )
    ) {
      throw new ForbiddenError(
        "You do not have permission to perform this action",
      );
    }

    next();
  };
};