import * as Sentry from "@sentry/nextjs";
import stripe from "../../../server/stripe";
import { buffer } from "micro";
import dayjs from "dayjs";
import prismaClient from "../../../server/prisma/prismadb";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const createSubscription = async (subscriptionData) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: { stripeCustomerId: subscriptionData.stripeCustomerId },
    });

    const output = await prismaClient.subscription.upsert({
      where: { stripeCustomerId: subscriptionData.stripeCustomerId },
      update: subscriptionData,
      create: {
        ...subscriptionData,
        User: { connect: { id: user.id } },
      },
    });

    return output;
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    return "prc milojko";
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
        };

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
        };

        return await createSubscription(options);
      }

      break;

    case "invoice.payment_succeeded":
      // If a payment succeeded we update stored subscription status to "active"
      // in case it was previously "trialing" or "past_due".
      // We skip if amount due is 0 as that's the case at start of trial period.
      // if (object.amount_due > 0) {
      //   await updateUserByCustomerId(object.customer, {
      //     stripeSubscriptionStatus: "active",
      //   });
      // }

      break;

    case "invoice.payment_failed":
      // If a payment failed we update stored subscription status to "past_due"
      // await updateUserByCustomerId(object.customer, {
      //   stripeSubscriptionStatus: "past_due",
      // });

      break;

    case "customer.subscription.updated":
      // const updatedSubscription = await stripe.subscriptions.retrieve(
      //   paymentIntent.id,
      //   { expand: ["customer"] }
      // );

      options = {
        subId: paymentIntent.id,
        status: paymentIntent.status,
        type: "subscription",
        created_at: dayjs().toDate(),
        ends_on: dayjs.unix(paymentIntent.current_period_end).toDate(),
      };

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

      try {
        return await prismaClient.subscription.update({
          where: { stripeCustomerId: paymentIntent.customer },
          data: options,
        });
      } catch (error) {
        Sentry.captureException(error);
      }

      break;

    case "customer.subscription.trial_will_end":
      // This event happens 3 days before a trial ends
      // 💡 You could email user letting them know their trial will end or you can have Stripe do that
      // automatically 7 days in advance: https://dashboard.stripe.com/settings/billing/automatic

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
