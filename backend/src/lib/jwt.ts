import "dotenv/config";

import jwt, {
  type JwtPayload,
  type SignOptions,
} from "jsonwebtoken";

const jwtSecret =
  process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error(
    "JWT_SECRET is not defined. Add it to the backend .env file.",
  );
}

const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN ?? "15m";

export interface AccessTokenPayload
  extends JwtPayload {
  sub: string;
  email: string;
}

export interface CreateAccessTokenInput {
  userId: number;
  email: string;
}

export const createAccessToken = (
  input: CreateAccessTokenInput,
): string => {
  const options: SignOptions = {
    expiresIn:
      JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      email: input.email,
    },
    jwtSecret,
    {
      ...options,
      subject: input.userId.toString(),
    },
  );
};