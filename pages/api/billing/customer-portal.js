import { WEBSITE_PATHNAME } from "../../../config";
import prismaClient from "../../../server/prisma/prismadb";
import stripe from "../../../server/stripe";

async function handler(req, res) {
  const { userId } = req.body;

  if (!userId) {
    throw new Error("Missing user id");
  }

  const user = await prismaClient.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User does not exist.");
  }

  let customerId;
  if (user.stripeCustomerId) {
    customerId = user.stripeCustomerId;
  } else {
    const customer = await stripe.customers.create({
      email: user.email,
    });

    customerId = customer.id;

    await prismaClient.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: req.body.returnUrl
      ? `${WEBSITE_PATHNAME}/${req.body.returnUrl}`
      : `${WEBSITE_PATHNAME}/pricing`,
  });

  res.status(200).json(session);
}

export default handler;
