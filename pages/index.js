import Head from "next/head";
import AllCoinsTable from "../components/AllCoinsTable/AllCoinsTable";
import { AppContextProvider } from "../components/Context/Context";
import { formatPrice } from "../components/Currency/Currency";
import ExplainerSection from "../components/ExplainerSection/ExplainerSection";
import MainHero from "../components/Hero/MainHero";
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
      </Head>
      <main className="w-full bg-white dark:bg-gray-900">
        <MainHero />
        <div className="container lg:px-6 max-w-7xl mx-auto max-w-80 ">
          <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-4xl block px-4 lg:px-0">
            Select a coin to{" "}
            <span className="inline text-indigo-600 dark:text-yellow-500 ">
              calculate
            </span>{" "}
            dollar cost average
          </h2>
          <AllCoinsTable showOnlyNTokens={10} />
        </div>
        <section className="mt-10 container lg:px-6 max-w-7xl mx-auto max-w-80 ">
          <ExplainerSection />
        </section>
        <section className="mt-16 bg-indigo-500 dark:bg-yellow-500 flex items-center justify-center">
          <div className="container lg:px-6 max-w-7xl mx-auto max-w-80 py-10 ">
            <div className="w-full text-center">
              <h3 className="text-3xl px-4 sm:text-4xl tracking-tight pb-6 font-bold text-gray-100 dark:text-gray-900">
                Annual return dollar cost averaging {formatPrice(50)} a week
              </h3>
            </div>
            <div className="flex items-center justify-center flex-col md:flex-row">
              <div className="flex w-1/3 flex-col text-center py-3">
                <span className="w-full tracking-tight text-6xl font-extrabold text-gray-100 dark:text-gray-900">
                  346%
                </span>
                <span className="w-full text-indigo-200 dark:text-yellow-800 font-medium text-lg">
                  Bitcoin
                </span>
              </div>
              <div className="flex w-1/3 flex-col text-center py-3">
                <span className="w-full tracking-tight text-6xl font-extrabold text-gray-100 dark:text-gray-900">
                  746%
                </span>
                <span className="w-full text-indigo-200 dark:text-yellow-800 font-medium text-lg">
                  Ethereum
                </span>
              </div>
              <div className="flex w-1/3 flex-col text-center py-3">
                <span className="w-full tracking-tight text-6xl font-extrabold text-gray-100 dark:text-gray-900">
                  2227%
                </span>
                <span className="w-full text-indigo-200 dark:text-yellow-800 font-medium text-lg">
                  Binance Coin
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-100 flex border-t h-20 justify-center items-center bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-900">
        DCA CC - Dollar Cost Averaging Cryptocurrency
      </footer>
    </div>
  );
}
