import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import User from "../../../server/models/User";
import bcrypt from "bcrypt";

export default NextAuth({
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
        const user = await User.findOne({ email: credentials.email });

        const isMatchingUser = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (isMatchingUser) {
          return user;
        } else {
          return null;
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        }
      },
    }),
  ],

  // A database is optional, but required to persist accounts in a database
  //   database: process.env.DATABASE_URL,
});
