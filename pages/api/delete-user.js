import { withSentry } from "@sentry/nextjs";
import { upstashAdopter } from "../../database/redis";
import stripe from "../../database/stripe";

async function handler(req, res) {
  // TODO: Make this dynamic
  const USER_ID = "153e8b30-0146-4dd5-9b31-7ed309543b1d";

  const user = await upstashAdopter.getUser(USER_ID);

  await upstashAdopter.deleteUser(user.id);

  const deleted = await stripe.customers.del(user.stripeCustomerId);

  res.status(200).json({ status: "ok", deleted });
}

export default withSentry(handler);
