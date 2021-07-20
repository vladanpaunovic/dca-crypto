import Head from "next/head";
import React from "react";
import AllCoinsTable from "../components/AllCoinsTable/AllCoinsTable";
import { AppContextProvider } from "../components/Context/Context";
import Footer from "../components/Footer/Footer";
import LandingHero from "../components/LandingHero/LandingHero";
import WhatIsDCA from "../components/LandingPage/WhatIsDCA";
import { CACHE_INVALIDATION_INTERVAL, defaultCurrency } from "../config";
import { getAllCoins } from "../queries/queries";
import { NextSeo } from "next-seo";

export async function getServerSideProps(context) {
  const availableTokens = await getAllCoins(
    context.query.currency || defaultCurrency
  );

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
  );

  return {
    props: {
      availableTokens,
    },
  };
}

export default function HomeWrapper(props) {
  return (
    <AppContextProvider availableTokens={props.availableTokens}>
      <Home {...props} />
    </AppContextProvider>
  );
}

function Home(props) {
  return (
    <div className="w-full">
      <NextSeo
        title="Dollar cost average cryptocurrency"
        description="Dollar cost average calculator for top 100 cryptocurrencies. Visualise and examine the impact of your investments in crypto."
      />
      <main className="w-full bg-white dark:bg-gray-900">
        <LandingHero availableTokens={props.availableTokens} />
        <div className="container mx-auto max-w-7xl bg-white dark:bg-gray-900 flex flex-col md:flex-row mt-16 mb-8 md:p-8">
          <div className="mb-16 w-3/3 md:w-1/3 px-6 md:px-0">
            <h2 className="text-base text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide uppercase">
              DCA Calculator
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Calculate DCA for your favorite coins
            </p>
          </div>
          <div className="w-3/3 md:w-2/3 dark:text-white">
            <AllCoinsTable showOnlyNTokens={10} showSearch={false} type="dca" />
          </div>
        </div>

        <section className="mx-auto bg-white dark:bg-gray-900">
          <WhatIsDCA />
        </section>

        <div className="container mx-auto max-w-7xl bg-white dark:bg-gray-900 flex flex-col md:flex-row mt-16 mb-8 md:p-8">
          <div className="mb-16 w-3/3 md:w-1/3 px-6 md:px-0">
            <h2 className="text-base text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide uppercase">
              Lump Sum Calculator
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Calculate Lump Sum investments for your favorite coins
            </p>
          </div>
          <div className="w-3/3 md:w-2/3 pr-4 dark:text-white">
            <AllCoinsTable
              showOnlyNTokens={10}
              showSearch={false}
              type="lump-sum"
            />
          </div>
        </div>
      </main>

      <Footer availableTokens={props.availableTokens} />
    </div>
  );
}
