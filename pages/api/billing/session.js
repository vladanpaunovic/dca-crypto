import * as Sentry from "@sentry/nextjs";
import { WEBSITE_PATHNAME } from "../../../config";
import stripe from "../../../server/stripe";

async function handler(req, res) {
  const mode = req.body.type === "recurring" ? "subscription" : "payment";

  const options = {
    success_url: `${WEBSITE_PATHNAME}/?payment=success`,
    cancel_url: `${WEBSITE_PATHNAME}/pricing?payment=error`,
    line_items: [{ price: req.body.priceId, quantity: 1 }],
    mode,
    ...(req.body.customerId ? { customer: req.body.customerId } : {}),
    ...(req.body.userId ? { metadata: { redisUserId: req.body.userId } } : {}),
  };

  const session = await stripe.checkout.sessions.create(options);
  res.status(200).json(session);
}

export default Sentry.withSentry(handler);
