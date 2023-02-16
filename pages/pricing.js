import React from "react";
import Footer from "../components/Footer/Footer";
import Navigation from "../components/Navigarion/Navigation";
import stripe from "../server/stripe";
import prismaClient from "../server/prisma/prismadb";
import Pricing from "../components/Pricing/Pricing";

export async function getStaticProps() {
  const bigKeyValueStore = await prismaClient.bigKeyValueStore.findUnique({
    where: { key: "availableTokens" },
  });

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

  return {
    props: {
      availableTokens: bigKeyValueStore.value,
      pricing: stripNonActiveProducts,
    },
  };
}

export default function HomeWrapper(props) {
  return (
    <>
      <Navigation />
      <Pricing {...props} />
      <div className="h-8 bg-gray-100 w-full" />
      <Footer availableTokens={props.availableTokens} />
    </>
  );
}
