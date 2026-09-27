import {
  afterAll,
  beforeAll,
  beforeEach,
} from "vitest";

import {
  config,
} from "dotenv";

const isContinuousIntegration =
  process.env.CI === "true";

if (!isContinuousIntegration) {
  const dotenvResult = config({
    path: ".env.test",
    override: true,
  });

  if (dotenvResult.error) {
    throw new Error(
      "Unable to load backend/.env.test.",
    );
  }
}

const databaseUrl =
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    isContinuousIntegration
      ? "DATABASE_URL is missing from the CI environment."
      : "DATABASE_URL is missing from .env.test.",
  );
}

let databaseName: string;

try {
  const parsedDatabaseUrl =
    new URL(databaseUrl);

  databaseName =
    parsedDatabaseUrl.pathname
      .replace(/^\//, "")
      .split("?")[0];
} catch {
  throw new Error(
    isContinuousIntegration
      ? "DATABASE_URL in the CI environment is invalid."
      : "DATABASE_URL in .env.test is invalid.",
  );
}

if (databaseName !== "customer360_test") {
  throw new Error(
    `Tests cannot run against database "${databaseName}". Expected "customer360_test".`,
  );
}

let prisma:
  typeof import(
    "../src/lib/prisma.js"
  ).prisma;

beforeAll(async () => {
  const prismaModule =
    await import(
      "../src/lib/prisma.js"
    );

  prisma = prismaModule.prisma;

  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect();
});