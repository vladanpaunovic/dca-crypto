import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import User from "../../../server/models/User";
import connectDB from "../../../server/mongodb";
// import argon2 from "argon2";

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
        const user = await User.findOne({ email: credentials.email });

        if (user) {
          // const isMatchingUser = argon2.verify(
          //   user.password,
          //   credentials.password
          // );

          const isMatchingUser = user.password === credentials.password;

          if (isMatchingUser) {
            return user;
          }
        }

        return null;
        // You can also Reject this callback with an Error or with a URL:
        // throw new Error('error message') // Redirect to error page
        // throw '/path/to/redirect'        // Redirect to a URL
      },
    }),
  ],

  // A database is optional, but required to persist accounts in a database
  //   database: process.env.DATABASE_URL,
});

export default connectDB(auth);
