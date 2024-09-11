import { WEBSITE_PATHNAME } from "../../../config";
import stripe from "../../../server/stripe";
import prismaClient from "../../../server/prisma/prismadb";

async function handler(req, res) {
  const { userId } = req.body;

  const options = {
    cancel_url: `${WEBSITE_PATHNAME}/pricing?payment=error`,
    line_items: [{ price: req.body.priceId, quantity: 1 }],
    mode: req.body.type === "recurring" ? "subscription" : "payment",
  };

  if (userId) {
    const user = await prismaClient.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    options.customer_email = user.email;
    options.success_url = `${WEBSITE_PATHNAME}/thank-you?payment=success`;

    if (user.stripeCustomerId) {
      options.customer = user.stripeCustomerId;
    }
  } else {
    options.success_url = `${WEBSITE_PATHNAME}/thank-you?payment=success&newUser=true`;
  }

  const session = await stripe.checkout.sessions.create(options);

  res.status(200).json(session);
}

export default handler;
