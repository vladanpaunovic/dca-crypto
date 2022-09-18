import React, { useState } from "react";
import AllCoinsTable from "../components/AllCoinsTable/AllCoinsTable";
import { AppContextProvider } from "../components/Context/Context";
import Footer from "../components/Footer/Footer";
import AllTokensHero from "../components/Hero/AllTokensHero";
import { CACHE_INVALIDATION_INTERVAL, defaultCurrency } from "../config";
import { getAllCoins } from "../queries/queries";
import { NextSeo } from "next-seo";
import Navigation from "../components/Navigarion/Navigation";

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
      calcType: context.query.type || "dca",
    },
  };
}

export default function HomeWrapper(props) {
  return (
    <AppContextProvider availableTokens={props.availableTokens}>
      <AllTokens {...props} />
    </AppContextProvider>
  );
}

function AllTokens(props) {
  const [calcType, setCalcType] = useState(props.calcType);

  const isDca = calcType === "dca";
  return (
    <div className="w-full">
      <NextSeo
        title={`${
          isDca ? "Dollar cost average" : "Lump sum investing"
        } cryptocurrency`}
        description={`List of all cryptocurrencies available for calculating ${
          isDca ? "dollar cost average" : "lump sum investing"
        } . Visualise and examine the impact of your investments in top 100 cryptocurrencies.`}
      />
      <main className="w-full bg-white dark:bg-gray-900">
        <Navigation />
        <AllTokensHero type={calcType} />
        <div className="container px-4 lg:px-8 mt-4 max-w-7xl mx-auto max-w-80 bg-white dark:bg-gray-900">
          <button
            onClick={() => {
              isDca ? setCalcType("lump-sum") : setCalcType("dca");
            }}
            className="border-2 px-2 py-1 rounded-md border-indigo-500 dark:border-yellow-500 font-medium text-indigo-500 dark:text-gray-900 dark:bg-yellow-500"
          >
            {isDca ? "Switch to lump sum investing" : "Switch to DCA"}
          </button>
        </div>

        <div className="container lg:px-6 max-w-7xl mx-auto max-w-80 bg-white dark:bg-gray-900 mt-10">
          <AllCoinsTable showSearch type={calcType} />
        </div>
      </main>

      <Footer availableTokens={props.availableTokens} />
    </div>
  );
}
