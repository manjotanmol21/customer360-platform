import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  UnauthorizedError,
} from "../errors/app.error.js";

import {
  verifyAccessToken,
} from "../lib/jwt.js";

export interface AuthenticatedUser {
  id: number;
  email: string;
}

export interface AuthenticatedRequest
  extends Request {
  user?: AuthenticatedUser;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authorizationHeader =
    req.headers.authorization;

  if (!authorizationHeader) {
    throw new UnauthorizedError(
      "Authentication required",
    );
  }

  const [scheme, token] =
    authorizationHeader.split(" ");

  if (
    scheme !== "Bearer" ||
    !token
  ) {
    throw new UnauthorizedError(
      "Invalid authorization header",
    );
  }

  try {
    const payload =
      verifyAccessToken(token);

    const userId =
      Number(payload.sub);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new UnauthorizedError(
        "Invalid access token",
      );
    }

    req.user = {
      id: userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (
      error instanceof UnauthorizedError
    ) {
      throw error;
    }

    throw new UnauthorizedError(
      "Invalid or expired access token",
    );
  }
};