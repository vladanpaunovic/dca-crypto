import React from "react";
import { AppContextProvider } from "../components/Context/Context";
import Footer from "../components/Footer/Footer";
import { CACHE_INVALIDATION_INTERVAL } from "../config";
import { getAllCoins, getDCAChartData } from "../queries/queries";
import { NextSeo } from "next-seo";
import NavigationMenu from "../components/Menu/Menu";
import CoinCalculator from "../components/LandingPage/CoinCalculator";
import { generateDefaultInput } from "../common/generateDefaultInput";
import dayjs from "dayjs";
import { AdBannerBig, AdBannerMedium } from "../components/Ads/Ads";
import AllCoinsTable from "../components/AllCoinsTable/AllCoinsTable";

export async function getServerSideProps(context) {
  const today = dayjs().format("YYYY-MM-DD");
  const before5Years = dayjs(today).subtract(5, "year").format("YYYY-MM-DD");
  const payload = generateDefaultInput({
    coin: "bitcoin",
    dateFrom: before5Years,
    dateTo: today,
    investment: 10,
  });

  const [availableTokens, chartData] = await Promise.all([
    getAllCoins(payload.currency),
    getDCAChartData(payload),
  ]);

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
  );

  return {
    props: {
      availableTokens,
      chartData,
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
        <NavigationMenu availableTokens={props.availableTokens} />
        <section className="mx-auto p-8 primary-gradient dark:bg-gray-800 text-center">
          <div className="container mx-auto">
            <h1 className="h1-title text-4xl md:text-7xl text-center mb-4 text-white dark:text-gray-900">
              Cryptocurrency DCA and Lump sum calculator
            </h1>
            <p className="text-center text-xl md:text-3xl text-gray-200 dark:text-yellow-900">
              Calculate (backtest) compound interest using dollar cost
              averageing or lump sum invesing strategies
            </p>
          </div>
        </section>

        <section className="container mx-auto my-8 md:p-8">
          <CoinCalculator
            chartData={props.chartData}
            availableTokens={props.availableTokens}
          />
        </section>

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
        <section className="container mx-auto max-w-7xl my-8">
          <div className="justify-center hidden md:flex">
            <AdBannerBig />
          </div>
          <div className="flex md:hidden justify-center">
            <AdBannerMedium />
          </div>
        </section>
      </main>

      <Footer availableTokens={props.availableTokens} />
    </div>
  );
}
