import {
  afterAll,
  beforeAll,
  beforeEach,
} from "vitest";

import {
  config,
} from "dotenv";

const dotenvResult = config({
  path: ".env.test",
  override: true,
});

if (dotenvResult.error) {
  throw new Error(
    "Unable to load backend/.env.test.",
  );
}

const databaseUrl =
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is missing from .env.test.",
  );
}

let databaseName: string;

try {
  const parsedDatabaseUrl =
    new URL(databaseUrl);

  databaseName =
    parsedDatabaseUrl.pathname.replace(
      /^\//,
      "",
    );
} catch {
  throw new Error(
    "DATABASE_URL in .env.test is invalid.",
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