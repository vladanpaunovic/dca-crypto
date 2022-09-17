import * as Sentry from "@sentry/nextjs";
import stripe from "../../../database/stripe";

async function handler(req, res) {
  const prices = await stripe.prices.list({
    expand: ["data.product"],
    active: true,
  });

  const stripNonActiveProducts = prices.data
    .filter((prices) => prices.product.active)
    // Ordering prices from lowest to highest
    .sort((a, b) => {
      if (a.unit_amount < b.unit_amount) {
        return -1;
      }

      if (a.unit_amount > b.unit_amount) {
        return 1;
      }

      return 0;
    });

  res.status(200).json(stripNonActiveProducts);
}

export default Sentry.withSentry(handler);
