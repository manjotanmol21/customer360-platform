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
    algorithm: "HS256",
    expiresIn:
      JWT_EXPIRES_IN as SignOptions["expiresIn"],
    subject: input.userId.toString(),
  };

  return jwt.sign(
    {
      email: input.email,
    },
    jwtSecret,
    options,
  );
};

export const verifyAccessToken = (
  token: string,
): AccessTokenPayload => {
  const payload = jwt.verify(
    token,
    jwtSecret,
    {
      algorithms: ["HS256"],
    },
  );

  if (
    typeof payload === "string" ||
    !payload.sub ||
    typeof payload.email !== "string"
  ) {
    throw new Error(
      "Invalid access token payload",
    );
  }

  return payload as AccessTokenPayload;
};