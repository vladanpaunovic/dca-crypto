import { mockDeep, mockReset } from "jest-mock-extended";
import prisma from "./prismadb";

jest.mock("./prismadb", () => ({
  __esModule: true,
  /** @type {import('@prisma/client').PrismaClient} */
  default: mockDeep(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma;
