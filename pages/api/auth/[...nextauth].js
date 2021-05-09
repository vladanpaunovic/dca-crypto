import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import cmsClient from "../../../server/cmsClient";
import { withSentry } from "@sentry/nextjs";

const auth = NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jondoe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await cmsClient().post("/auth/local", {
            identifier: credentials.email,
            password: credentials.password,
          });

          return response.data;
        } catch (e) {
          throw new Error(e);
        }

        return null;
        // You can also Reject this callback with an Error or with a URL:
        // throw new Error('error message') // Redirect to error page
        // throw '/path/to/redirect'        // Redirect to a URL
      },
    }),
  ],

  callbacks: {
    /**
     * @param  {object}  token     Decrypted JSON Web Token
     * @param  {object}  user      User object      (only available on sign in)
     * @param  {object}  account   Provider account (only available on sign in)
     * @param  {object}  profile   Provider profile (only available on sign in)
     * @param  {boolean} isNewUser True if new user (only available on sign in)
     * @return {object}            JSON Web Token that will be saved
     */
    async jwt(token, user, account, profile, isNewUser) {
      // Add access_token to the token right after signin
      if (user?.jwt) {
        token = {
          ...user,
          accessToken: user.jwt,
        };
      }
      return token;
    },

    /**
     * @param  {object} session      Session object
     * @param  {object} token        User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @return {object}              Session that will be returned to the client
     */
    async session(session, token) {
      // Add property to session, like an access_token from a provider.
      session = token;
      delete session.jwt;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    /**
     * @param  {string} url      URL provided as callback URL by the client
     * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
     * @return {string}          URL the client will be redirect to
     */
    async redirect(url, baseUrl) {
      if (!url) {
        return baseUrl;
      }

      return url;
      // return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
});

export default withSentry(auth);
