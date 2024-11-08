import * as Sentry from "@sentry/nextjs";
import stripe from "../../../server/stripe";
import { buffer } from "micro";
import dayjs from "dayjs";
import prismaClient, {
  createTokenForVerification,
  createVerificationTokenHash,
  PrismaAdapter,
} from "../../../server/prisma/prismadb";
import { WEBSITE_PATHNAME } from "../../../config";
import { loopsClient } from "../../../server/loops";

export const config = {
  api: {
    bodyParser: false,
  },
};

const prismaAdapter = PrismaAdapter(prismaClient);


const updateLoopsContactFromCustomerId = async (customerId, status) => {
  const user = await prismaClient.user.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!user?.email) {
    return;
  }

  await loopsClient.updateContact(user.email,
    {subscriptionStatus: status}
  )
}

const sendMagicLink = async (email, userId) => {
  /**
   * Create a verification token
   * This token is safe to send in an email as without
   * the secret key it is useless.
   **/
  const token = createTokenForVerification();

  // Hash the token for the database
  const hashedToken = await createVerificationTokenHash(token);

  // Store hashed token in the database
  prismaAdapter.createVerificationToken({
    identifier: email,
    token: hashedToken,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
  });

  const link = `${WEBSITE_PATHNAME}/api/auth/callback/email?token=${token}&email=${encodeURIComponent(
    email
  )}`;

  // send email with the link
  await loopsClient.sendEvent({
    eventName: "new_guest_user",
    email,
    userId,
    eventProperties: {
      login_url: link,
    },
  });

  return;
};

export const createSubscription = async (subscriptionData) => {
  const { email, ...rest } = subscriptionData;
  try {
    let user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (user) {
      /**
       * If the user exists, update their stripeCustomerId
       */
      await prismaClient.user.update({
        where: { email },
        data: { stripeCustomerId: subscriptionData.stripeCustomerId },
      });
    } else {
      /**
       * If the user doesn't exist, create a new user,
       * add their stripeCustomerId and email,
       * then send them a magic link to sign in
       */
      user = await prismaAdapter.createUser({
        email,
        stripeCustomerId: subscriptionData.stripeCustomerId,
      });

      await sendMagicLink(email, user.id);
    }

    const output = await prismaClient.subscription.upsert({
      where: { stripeCustomerId: rest.stripeCustomerId },
      update: rest,
      create: {
        User: { connect: { id: user.id } },
        ...rest,
      },
    });

    return output;
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    return "";
  }
};

export const handleStripeWebhook = async (event) => {
  let options;

  const paymentIntent = event.data.object;

  switch (event.type) {
    case "checkout.session.completed":
      if (paymentIntent.mode === "subscription") {
        const upcomingSubscription = await stripe.subscriptions.retrieve(
          paymentIntent.subscription,
          { expand: ["customer"] }
        );

        options = {
          subId: paymentIntent.subscription,
          status: "active",
          type: "subscription",
          created_at: dayjs().toDate(),
          ends_on: dayjs.unix(upcomingSubscription.current_period_end).toDate(),
          stripeCustomerId: paymentIntent.customer,
          email: paymentIntent.customer_details?.email,
        };

        await loopsClient.updateContact(options.email,
          {subscriptionStatus: paymentIntent.status}
        )

        return await createSubscription(options);
      }

      if (paymentIntent.mode === "payment") {
        options = {
          subId: paymentIntent.id,
          status: "active",
          type: "week_pass",
          created_at: dayjs().toDate(),
          ends_on: dayjs().add(7, "day").toDate(),
          stripeCustomerId: paymentIntent.customer,
          email: paymentIntent.customer_details?.email,
        };

        await loopsClient.updateContact(options.email,
          {subscriptionStatus: paymentIntent.status}
        )

        return await createSubscription(options);
      }

      break;

    case "customer.subscription.updated":
      options = {
        subId: paymentIntent.id,
        status: paymentIntent.status,
        type: "subscription",
        created_at: dayjs().toDate(),
        ends_on: dayjs.unix(paymentIntent.current_period_end).toDate(),
      };

      await updateLoopsContactFromCustomerId(paymentIntent.customer, paymentIntent.status);

      try {
        return await prismaClient.subscription.update({
          where: { stripeCustomerId: paymentIntent.customer },
          data: options,
        });
      } catch (error) {
        Sentry.captureException(error);
      }

      break;

    case "customer.subscription.deleted":
      options = { subId: paymentIntent.id, status: paymentIntent.status };

      await updateLoopsContactFromCustomerId(paymentIntent.customer, paymentIntent.status);
  
      try {
        return await prismaClient.subscription.update({
          where: { stripeCustomerId: paymentIntent.customer },
          data: options,
        });
      } catch (error) {
        Sentry.captureException(error);
      }

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

async function handler(req, res) {
  const signature = req.headers["stripe-signature"];
  const reqBuffer = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature,
      process.env.STRIPE_ENCRYPTION_SECRET
    );
  } catch (err) {
    console.log(err);
    Sentry.captureException(err);
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    // Handle the event
    await handleStripeWebhook(event);
  } catch (error) {
    Sentry.captureException(error);
    res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }

  res.status(200).json({ ok: true });
}

export default handler;
