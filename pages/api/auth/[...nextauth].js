import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import User from "../../../server/models/User";
import bcrypt from "bcrypt";
import connectDB from "../../../server/mongodb";

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
        console.log(credentials);
        const user = await User.findOne({ email: credentials.email });

        if (user) {
          const isMatchingUser = await bcrypt.compare(
            credentials.password,
            user.password
          );

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
