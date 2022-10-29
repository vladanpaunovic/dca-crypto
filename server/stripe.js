import stripe from "stripe";

/** @type {import('stripe').default} */
const stripeClient = stripe(process.env.STRIPE_TOKEN);

export default stripeClient;
