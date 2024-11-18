import React from "react";
import Footer from "../components/Footer/Footer";
import Navigation from "../components/Navigarion/Navigation";
import stripe from "../server/stripe";
import prismaClient from "../server/prisma/prismadb";
import Pricing from "../components/Pricing/Pricing";
import { ClockIcon } from "@heroicons/react/solid";

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

      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Unlock the Full Power of DCA-CC
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl text-indigo-100 sm:text-2xl md:mt-5 md:max-w-3xl">
              Join thousands of investors who use our premium features and make
              smarter investment decisions.
            </p>
          </div>
        </div>
      </div>
      <UrgencyBanner />
      <Pricing {...props} />
      <div className="h-8" />
      <Footer availableTokens={props.availableTokens} />
    </>
  );
}

export function UrgencyBanner() {
  return (
    <div className="bg-yellow-50 border-t border-b border-yellow-100">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center justify-center">
            <span className="flex p-2 rounded-lg bg-yellow-200">
              <ClockIcon
                className="h-6 w-6 text-yellow-800"
                aria-hidden="true"
              />
            </span>
            <p className="ml-3 font-medium text-yellow-900">
              <span className="md:hidden">Special offer ends soon!</span>
              <span className="hidden md:inline">
                Limited time offer: Get 2 months for free with annual plan -
                Offer ends in 24 hours!
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
