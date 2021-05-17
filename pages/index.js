import Head from "next/head";
import Link from "next/link";
import AllCoinsTable from "../components/AllCoinsTable/AllCoinsTable";
import { AppContextProvider } from "../components/Context/Context";
import { formatPrice } from "../components/Currency/Currency";
import ExplainerSection from "../components/ExplainerSection/ExplainerSection";
import MainHero from "../components/Hero/MainHero";
import AvailableExchanges from "../components/LandingPage/AvailableExchanges";
import FeatureDescription from "../components/LandingPage/FeatureDescription";
import FeaturePreview from "../components/LandingPage/FeaturePreview";
import WhatIsDCA from "../components/LandingPage/WhatIsDCA";
import { RegistrationCard } from "../components/PaymentCard/PaymentCard";
import { CACHE_INVALIDATION_INTERVAL, defaultCurrency } from "../config";
import { getAllCoins } from "../queries/queries";

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

function Home() {
  return (
    <div className="w-full">
      <Head>
        <title>DCA Crypto - Dollar cost average cryptocurrency</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content={`Dollar cost average calculator for top 100 cryptocurrencies. Visualise and examine the impact of your investments in crypto.`}
        />
      </Head>
      <main className="w-full bg-white dark:bg-gray-900">
        <MainHero />
        <section className="lg:px-6 mx-auto bg-white dark:bg-gray-900">
          <WhatIsDCA />
        </section>

        <section className="">
          <FeaturePreview />
        </section>
        <section className="my-36">
          <AvailableExchanges />
        </section>
        <section className="mb-24">
          <FeatureDescription />
        </section>

        <section className="mt-16 bg-gradient-to-br from-indigo-400 to-indigo-600 dark:from-yellow-400  dark:to-yellow-600  flex items-center justify-center">
          <RegistrationCard />
        </section>
        <div className="container mx-auto max-w-7xl bg-white dark:bg-gray-900 flex flex-col md:flex-row my-32">
          <div className="mb-16 w-3/3 md:w-1/3 pl-4 md:pl-0 md:pr-8">
            <h2 className="text-base text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide uppercase">
              Still not convinved?
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Calculate DCA for your favorite coin
            </p>
          </div>
          <div className="w-3/3 md:w-2/3 dark:text-white">
            <AllCoinsTable showOnlyNTokens={10} />
          </div>
        </div>
      </main>

      <footer className="w-100 flex border-t h-20 justify-center items-center bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-900">
        DCA CC - Dollar Cost Averaging Cryptocurrency
      </footer>
    </div>
  );
}
