import React from "react";
import AllCoinsTable from "../components/AllCoinsTable/AllCoinsTable";
import { AppContextProvider } from "../components/Context/Context";
import Footer from "../components/Footer/Footer";
import AllTokensHero from "../components/Hero/AllTokensHero";
import { CACHE_INVALIDATION_INTERVAL } from "../config";
import { NextSeo } from "next-seo";
import Navigation from "../components/Navigarion/Navigation";

import prismaClient from "../server/prisma/prismadb";

export async function getServerSideProps(context) {
  const bigKeyValueStore = await prismaClient.bigKeyValueStore.findUnique({
    where: { key: "availableTokens" },
  });

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
  );

  return {
    props: {
      availableTokens: bigKeyValueStore.value,
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
  return (
    <div className="w-full">
      <NextSeo
        title={`Dollar cost average cryptocurrency`}
        description={`List of all cryptocurrencies available for calculating dollar cost average. Visualise and examine the impact of your investments in top 100 cryptocurrencies.`}
      />
      <main className="w-full bg-white">
        <Navigation />
        <AllTokensHero />

        <div className="container lg:px-6 max-w-7xl mx-auto max-w-80 bg-white mt-10">
          <AllCoinsTable showSearch availableTokens={props.availableTokens} />
        </div>
      </main>

      <Footer availableTokens={props.availableTokens} />
    </div>
  );
}
