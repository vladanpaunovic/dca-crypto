import stripe from "stripe";

const stripeClient = stripe(process.env.STRIPE_TOKEN);

export default stripeClient;
