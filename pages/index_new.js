import React from "react";
import { AppContextProvider } from "../components/Context/Context";
import Footer from "../components/Footer/Footer";
import {
  availableCurrencies,
  CACHE_INVALIDATION_INTERVAL,
  defaultCurrency,
} from "../config";
import { getAllCoins } from "../queries/queries";
import { NextSeo } from "next-seo";
import NavigationMenu from "../components/Menu/Menu";
import LandingForm from "../components/LandingPage/LandingForm";
import SelectCoinList from "../components/LandingPage/SelectCoinList";

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
  const allTokens = [...props.availableTokens];
  return (
    <div className="w-full">
      <NextSeo
        title="Dollar cost average cryptocurrency"
        description="Dollar cost average calculator for top 100 cryptocurrencies. Visualise and examine the impact of your investments in crypto."
      />
      <main className="w-full bg-white dark:bg-gray-900">
        <NavigationMenu availableTokens={props.availableTokens} />
        <section className="container mx-auto max-w-7xl bg-white dark:bg-gray-900 flex flex-col md:flex-row mt-16 mb-8 md:p-8">
          <div className="w-3/3 md:w-1/2 px-6 md:px-0 mb-16 ">
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Calculate DCA or Lump sum investments for your favorite coins
            </h1>
            <p className="text-base text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide uppercase">
              DCA Calculator
            </p>
            <div>
              <SelectCoinList availableTokens={props.availableTokens} />
              {allTokens.slice(0, 10).map((token) => (
                <div key={token.id}>{token.name}</div>
              ))}
            </div>
          </div>
          <div className="w-3/3 md:w-1/2 dark:text-white">
            <LandingForm availableTokens={props.availableTokens} />
          </div>
        </section>
      </main>

      <Footer availableTokens={props.availableTokens} />
    </div>
  );
}
