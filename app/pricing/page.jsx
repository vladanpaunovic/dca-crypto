import React from "react";
import Footer from "../../components/Footer/Footer";
import { getAllPricingProducts } from "../../queries/queries";
import { NextSeo } from "next-seo";

import Navigation from "../../components/Navigarion/Navigation";
import PaymentMethods from "../../components/PaymentMethods/PaymentMethods";
import FAQ from "../../components/FAQ/FAQ";
import PricingTab from "./PricingTab";

export default async function Pricing() {
  const pricing = await getAllPricingProducts();

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

      <Footer />
    </div>
  );
}
