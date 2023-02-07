import React from "react";
import Footer from "../../components/Footer/Footer";
import { NextSeo } from "next-seo";

import Navigation from "../../components/Navigarion/Navigation";
import PaymentMethods from "../../components/PaymentMethods/PaymentMethods";
import FAQ from "../../components/FAQ/FAQ";
import PricingTab from "../../components/PricingTab/PricingTab";
import stripe from "../../server/stripe";

async function getData() {
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

  return stripNonActiveProducts;
}

export default async function Page() {
  const pricing = await getData();

  return (
    <div className="w-full">
      <NextSeo
        useAppDir
        title="Pricing &amp; Upgrade - DCA-CC"
        description="Select a plan that's right for you"
      />
      <main className="w-full ">
        <Navigation />
        <div className="px-8 py-16">
          <h1 className="h1-title text-center">
            Select a plan that is right for you
          </h1>
        </div>
        <div className="w-full p-8 gap-8 flex-col md:flex-row bg-white dark:bg-gray-900 flex justify-center">
          {pricing.map((price) => (
            <PricingTab key={price.id} {...price} />
          ))}
        </div>
        <div className="w-full flex justify-center pt-16 pb-8">
          <PaymentMethods />
        </div>
        <div className="w-full flex justify-center pt-16 pb-8">
          <FAQ />
        </div>
      </main>

      <Footer availableTokens={[]} />
    </div>
  );
}
