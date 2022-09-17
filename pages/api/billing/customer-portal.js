import * as Sentry from "@sentry/nextjs";
import { WEBSITE_PATHNAME } from "../../../config";
import stripe from "../../../database/stripe";

async function handler(req, res) {
  const session = await stripe.billingPortal.sessions.create({
    customer: req.body.customerId,
    return_url: req.body.returnUrl
      ? `${WEBSITE_PATHNAME}/${req.body.returnUrl}`
      : `${WEBSITE_PATHNAME}/pricing`,
  });

  res.status(200).json(session);
}

export default Sentry.withSentry(handler);
