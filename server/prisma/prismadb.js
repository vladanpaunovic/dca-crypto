import { PrismaClient } from "@prisma/client";
import { WEBSITE_PATHNAME } from "../../config";
import { trackPlausibleEvent } from "../plausible";
import posthogClient from "../../src/posthog";

/** @type {import('@prisma/client').PrismaClient} */
const prismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prismaClient;
}

export async function createVerificationTokenHash(message) {
  const data = new TextEncoder().encode(
    `${message}${process.env.STRIPE_ENCRYPTION_SECRET}`
  );
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString();
}

export function createTokenForVerification() {
  const i2hex = (i) => ("0" + i.toString(16)).slice(-2);
  const r = (a, i) => a + i2hex(i);
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes).reduce(r, "");
}

/** @type {import('@next-auth/prisma-adapter')} */
export function PrismaAdapter(pClient) {
  /** @type {import('@prisma/client').PrismaClient} */
  const p = pClient;

  return {
    createUser: (data) => {
      trackPlausibleEvent(
        {
          name: "user_create",
          url: `${WEBSITE_PATHNAME}/auth/signup`,
        },
        data.email,
        data.email
      );

      posthogClient.capture({
        distinctId: data.email,
        event: "user_create",
        properties: {
          email: data.email,
        },
      });

      return p.user.create({ data });
    },
    getUser: (id) => {
      return p.user.findUnique({
        where: { id },
        include: { subscription: true },
      });
    },
    getUserByEmail: (email) => {
      return p.user.findUnique({
        where: { email },
        include: { subscription: true },
      });
    },
    async getUserByAccount(provider_providerAccountId) {
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        include: { user: { include: { subscription: true } } },
      });
      return account?.user ?? null;
    },
    updateUser: ({ id, ...data }) => {
      return p.user.update({ where: { id }, data });
    },
    deleteUser: (id) => {
      return p.user.delete({ where: { id } });
    },
    linkAccount: (data) => {
      return p.account.create({ data });
    },
    unlinkAccount: (provider_providerAccountId) => {
      return p.account.delete({
        where: { provider_providerAccountId },
      });
    },
    async getSessionAndUser(sessionToken) {
      const userAndSession = await p.session.findUnique({
        where: { sessionToken },
        include: { user: { include: { subscription: true } } },
      });

      if (!userAndSession) {
        return null;
      }

      const { user, ...session } = userAndSession;
      return { user, session };
    },
    createSession: (data) => {
      return p.session.create({ data });
    },
    updateSession: (data) => {
      return p.session.update({
        where: { sessionToken: data.sessionToken },
        data,
      });
    },
    deleteSession: (sessionToken) => {
      return p.session.delete({ where: { sessionToken } });
    },
    async createVerificationToken(data) {
      const verificationToken = await p.verificationToken.create({ data });
      // @ts-expect-errors // MongoDB needs an ID, but we don't
      if (verificationToken.id) delete verificationToken.id;

      return verificationToken;
    },
    async useVerificationToken(identifier_token) {
      try {
        const verificationToken = await p.verificationToken.delete({
          where: { identifier_token },
        });

        // @ts-expect-errors // MongoDB needs an ID, but we don't
        if (verificationToken.id) delete verificationToken.id;
        return verificationToken;
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if (error.code === "P2025") return null;
        throw error;
      }
    },
  };
}

export default prismaClient;
