import jwt, {
  type JwtPayload,
  type SignOptions,
} from "jsonwebtoken";

import {
  env,
} from "../config/env.js";

import {
  UserRole,
} from "../generated/prisma/enums.js";

export interface AccessTokenPayload
  extends JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface CreateAccessTokenInput {
  userId: number;
  email: string;
  role: UserRole;
}

export const createAccessToken = (
  input: CreateAccessTokenInput,
): string => {
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn:
      env.jwtExpiresIn as
        SignOptions["expiresIn"],
    subject: input.userId.toString(),
  };

  return jwt.sign(
    {
      email: input.email,
      role: input.role,
    },
    env.jwtSecret,
    options,
  );
};

export const verifyAccessToken = (
  token: string,
): AccessTokenPayload => {
  const payload = jwt.verify(
    token,
    env.jwtSecret,
    {
      algorithms: ["HS256"],
    },
  );

  if (
    typeof payload === "string" ||
    !payload.sub ||
    typeof payload.email !==
      "string" ||
    !Object.values(UserRole).includes(
      payload.role as UserRole,
    )
  ) {
    throw new Error(
      "Invalid access token payload",
    );
  }

  return payload as AccessTokenPayload;
};