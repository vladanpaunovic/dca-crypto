import * as Sentry from "@sentry/nextjs";
import stripe from "../../../database/stripe";

async function handler(req, res) {
  const prices = await stripe.prices.list({
    expand: ["data.product"],
    active: true,
  });

  const stripNonActiveProducts = prices.data.filter(
    (prices) => prices.product.active
  );

  res.status(200).json(stripNonActiveProducts);
}

export default Sentry.withSentry(handler);
