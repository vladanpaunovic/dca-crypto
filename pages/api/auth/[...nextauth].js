import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { WEBSITE_EMAIL, WEBSITE_PATHNAME } from "../../../config";
import * as Sentry from "@sentry/nextjs";

import prismaClient, { PrismaAdapter } from "../../../server/prisma/prismadb";
import { trackPlausibleEvent } from "../../../server/plausible";
import posthogClient from "../../../src/posthog";

/** @type {import('next-auth').NextAuthOptions} */
export const authOptions = {
  adapter: PrismaAdapter(prismaClient),
  providers: [
    EmailProvider({
      server: {
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_TOKEN,
        },
      },
      from: WEBSITE_EMAIL,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  events: {
    async signIn(message) {
      const isPaidUser = message.user?.subscription?.status === "active";
      trackPlausibleEvent(
        {
          name: "user_signin",
          url: `${WEBSITE_PATHNAME}/auth/signin`,
        },
        message.user.name,
        message.user.name
      );

      Sentry.setUser({
        email: message.user.email,
        segment: isPaidUser
          ? `paid_${message.user?.subscription?.type}`
          : "free_user",
      });

      posthogClient.capture({
        distinctId: message.user.email,
        event: "user_signin",
        properties: {
          email: message.user.email,
          subscription_type: message.user.subscription?.type,
          is_paid: isPaidUser,
        },
      });
    },
    async signOut() {
      Sentry.setUser(null);
    },

    async createUser(message) {
      trackPlausibleEvent(
        {
          name: "user_create",
          url: `${WEBSITE_PATHNAME}/auth/signup`,
        },
        message.user.email,
        message.user.email
      );

      posthogClient.capture({
        distinctId: message.user.email,
        event: "user_create",
        properties: {
          email: message.user.email,
        },
      });
    },
  },
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          stripeCustomerId: user.stripeCustomerId,
          subscription: user.subscription,
          hasActivePackage: user?.subscription?.status === "active",
        },
      };
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith("https://checkout.stripe.com")) {
        return url;
      }

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },
  secret: process.env.STRIPE_ENCRYPTION_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
