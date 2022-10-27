import { mockDeep, mockReset } from "jest-mock-extended";
import stripeClient from "../stripe";

jest.mock("../stripe", () => ({
  __esModule: true,
  /** @type {import('stripe').default} */
  default: mockDeep(),
}));

beforeEach(() => {
  mockReset(stripeMock);
});

export const stripeMock = stripeClient;
