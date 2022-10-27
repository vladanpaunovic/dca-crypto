import { withSentry } from "@sentry/nextjs";
import stripe from "../../server/stripe";

import prismaClient, { PrismaAdapter } from "../../server/prisma/prismadb";

const prisma = PrismaAdapter(prismaClient);

async function handler(req, res) {
  // TODO: Make this dynamic
  const USER_ID = "635c32a6a1ee2658ef76aad9";

  const user = await prisma.getUser(USER_ID);

  await prisma.deleteUser(USER_ID);

  const deleted = await stripe.customers.del(user.stripeCustomerId);

  res.status(200).json({ status: "ok", deleted });
}

export default withSentry(handler);
