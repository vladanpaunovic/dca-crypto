import * as Sentry from "@sentry/nextjs";
import stripe from "../../../server/stripe";
import { buffer } from "micro";
import { upstashAdopter } from "../../../server/redis";
import dayjs from "dayjs";

export const config = {
  api: {
    bodyParser: false,
  },
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
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
    return;
  }

  // Handle the event
  const paymentIntent = event.data.object;

  switch (event.type) {
    case "checkout.session.completed":
      if (paymentIntent.mode === "subscription") {
        const upcomingSubscription = await stripe.subscriptions.retrieve(
          paymentIntent.subscription
        );

        upstashAdopter.updateUser({
          id: paymentIntent.metadata.redisUserId,
          subscription: {
            subId: paymentIntent.subscription,
            status: "active",
            type: "subscription",
            created_at: dayjs().valueOf(),
            ends_on: dayjs
              .unix(upcomingSubscription.current_period_end)
              .valueOf(),
          },
        });
      }

      if (paymentIntent.mode === "payment") {
        upstashAdopter.updateUser({
          id: paymentIntent.metadata.redisUserId,
          subscription: {
            checkout_id: paymentIntent.id,
            payment_intent: paymentIntent.payment_intent,
            status: "active",
            type: "week_pass",
            created_at: dayjs().valueOf(),
            ends_on: dayjs().add(7, "day").valueOf(),
          },
        });
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
      const updatedSubscription = await stripe.subscriptions.retrieve(
        paymentIntent.id,
        { expand: ["customer"] }
      );

      upstashAdopter.updateUser({
        id: updatedSubscription.customer.metadata.redisUserId,
        subscription: {
          subId: paymentIntent.id,
          status: paymentIntent.status,
          type: "subscription",
          created_at: dayjs().valueOf(),
          ends_on: dayjs.unix(paymentIntent.current_period_end).valueOf(),
        },
      });

      break;

    case "customer.subscription.deleted":
      const deletedSubscription = await stripe.subscriptions.retrieve(
        paymentIntent.id,
        { expand: ["customer"] }
      );

      upstashAdopter.updateUser({
        id: deletedSubscription.customer.metadata.redisUserId,
        subscription: { subId: paymentIntent.id, status: paymentIntent.status },
      });

      break;

    case "customer.subscription.trial_will_end":
      // This event happens 3 days before a trial ends
      // 💡 You could email user letting them know their trial will end or you can have Stripe do that
      // automatically 7 days in advance: https://dashboard.stripe.com/settings/billing/automatic

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ ok: true });
}

export default Sentry.withSentry(handler);
