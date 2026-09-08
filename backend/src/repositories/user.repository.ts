import { prisma } from "../lib/prisma.js";

export interface UserRecord {
  id: number;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRecordInput {
  email: string;
  passwordHash: string;
}

export const findUserByEmail = async (
  email: string,
): Promise<UserRecord | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUserRecord = async (
  input: CreateUserRecordInput,
): Promise<UserRecord> => {
  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash: input.passwordHash,
    },
  });
};