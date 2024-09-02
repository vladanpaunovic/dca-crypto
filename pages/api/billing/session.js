import { WEBSITE_PATHNAME } from "../../../config";
import stripe from "../../../server/stripe";
import prismaClient from "../../../server/prisma/prismadb";

async function handler(req, res) {
  const { userId } = req.body;

  if (!userId) {
    throw new Error("Missing user id");
  }

  const user = await prismaClient.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User does not exist.");
  }

  const mode = req.body.type === "recurring" ? "subscription" : "payment";

  const options = {
    success_url: `${WEBSITE_PATHNAME}/thank-you?payment=success`,
    cancel_url: `${WEBSITE_PATHNAME}/pricing?payment=error`,
    line_items: [{ price: req.body.priceId, quantity: 1 }],
    mode,
    metadata: {
      redisUserId: userId,
      mongoUserId: userId,
    },
  };

  if (user.stripeCustomerId) {
    options.customer = user.stripeCustomerId;
  } else {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { redisUserId: user.id, mongoUserId: user.id },
    });

    options.customer = customer.id;

    await prismaClient.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });
  }

  const session = await stripe.checkout.sessions.create(options);

  res.status(200).json(session);
}

export default handler;
