import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { WEBSITE_EMAIL } from "../../../config";
import { upstashAdopter } from "../../../database/redis";
import stripe from "../../../database/stripe";

export const authOptions = {
  adapter: upstashAdopter,
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
    async createUser({ user }) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { redisUserId: user.id },
      });

      await upstashAdopter.updateUser({
        id: user.id,
        stripeCustomerId: customer.id,
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
};

export default NextAuth(authOptions);
