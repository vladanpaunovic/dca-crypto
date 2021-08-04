import InputFormLumpSum from "../../components/InputFormLumpSum/InputFormLumpSum";
import {
  AppContextProvider,
  useAppContext,
} from "../../components/Context/Context";
import DataTable from "../../components/DataTable/DataTable";
import Information from "../../components/Information/Information";
import { getAllCoins, getLumpSumChartData } from "../../queries/queries";
import {
  CACHE_INVALIDATION_INTERVAL,
  defaultCurrency,
  WEBSITE_URL,
} from "../../config";
import { useCurrentCoin } from "../../components/Context/mainReducer";
import { TweetMessage } from "../../components/TweetMessage/TweetMessage";
import Footer from "../../components/Footer/Footer";
import React from "react";
import Logo from "../../components/Logo/Logo";
import ThemeSwitch from "../../components/ThemeSwitch/ThemeSwitch";
import { generateDefaultInput } from "../../common/generateDefaultInput";
import { NextSeo } from "next-seo";
import BreadcrumbLumpSum from "../../components/Breadcrumb/BreadcrumbLumpSum";
import WhatIsLumpSum from "../../components/LandingPage/WhatIsLumpSum";
import dynamic from "next/dynamic";
import Loading from "../../components/Loading/Loading";
import { AdBannerBig, AdBannerMedium } from "../../components/Ads/Ads";

const DynamicChart = dynamic(() => import("../../components/Chart/Chart"), {
  ssr: false,
  loading: () => <Loading withWrapper />,
});

const DynamicChartBalance = dynamic(
  () => import("../../components/Chart/ChartBalance"),
  {
    ssr: false,
    loading: () => <Loading withWrapper />,
  }
);

const DynamicAffiliateLinks = dynamic(
  () => import("../../components/AffiliateLinks/AffiliateLinks"),
  {
    ssr: false,
    loading: () => <Loading withWrapper />,
  }
);

export async function getServerSideProps(context) {
  const currency = context.query.currency || defaultCurrency;

  const payload = generateDefaultInput(context.query);

  const [availableTokens, chartData] = await Promise.all([
    getAllCoins(currency),
    getLumpSumChartData(payload),
  ]);

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
  );

  return {
    props: {
      availableTokens,
      chartData,
      ...payload,
    },
  };
}

const Coin = (props) => {
  const { state } = useAppContext();
  const currentCoin = useCurrentCoin();
  const coinSymbol = currentCoin.symbol.toUpperCase();

  return (
    <div className="w-full">
      <NextSeo
        title={`Lump sum ${currentCoin.name} (${coinSymbol}) calculator`}
        description={`Lump sum investing calculator for ${currentCoin.name} (${coinSymbol}). Visualise and examine the impact of your investments in ${currentCoin.name} or any other popular crypto.`}
        canonical={`https://${WEBSITE_URL}/lump-sum/${currentCoin.id}`}
        openGraph={{
          images: [
            {
              url: `https://${WEBSITE_URL}/images/meta-open-graph-lump-sum.jpg`,
              width: 1200,
              height: 697,
              alt: "Lump sum calculator",
            },
          ],
        }}
      />
      <main>
        <div className="grid grid-cols-6 w-full gap-8">
          <div className="col-span-6">
            <div className="flex items-center">
              <h1 className="h1-title">
                Lump sum investing calculator for{" "}
                <span className="text-indigo-700 dark:text-yellow-500 capitalize">
                  {currentCoin.name} ({coinSymbol})
                </span>{" "}
                backtesting
              </h1>
              {state.input.isLoading ? null : (
                <img
                  className="w-8 h-8 ml-2 hidden sm:block"
                  src={currentCoin.image}
                  alt={`${currentCoin.name} logo`}
                  width="40"
                  height="40"
                />
              )}
            </div>
          </div>
          <div className="col-span-6">
            <BreadcrumbLumpSum
              name={currentCoin.name}
              coinId={currentCoin.id}
            />
            <div className="shadow-xl border bg-white dark:bg-gray-900 dark:border-gray-800 md:rounded-lg md:p-6 mb-8">
              <div className="py-5 px-4 dark:bg-gray-900">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Price development of {coinSymbol}
                </h3>
                <TweetMessage />
              </div>
              <div className="h-96 md:p-4 dark:bg-gray-900 flex items-center">
                <DynamicChart />
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <AdBannerBig />
            </div>
            <div className="grid gap-8 mt-8 grid-cols-6">
              <div
                className={`col-span-6 md:col-span-3 shadow-xl border bg-white dark:bg-gray-900 dark:border-gray-800 md:rounded-lg mb-8 transition ${
                  state.input.isLoading ? "opacity-10" : ""
                }`}
              >
                <Information />
              </div>
              <div
                className={`col-span-6 md:col-span-3 shadow-xl border bg-white dark:bg-gray-900 dark:border-gray-800 md:rounded-lg mb-8 transition  ${
                  state.input.isLoading ? "opacity-10" : ""
                }`}
              >
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Balance of your asset valuation
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-white">
                    Estimate the development of your earnings over time
                  </p>
                </div>
                <div className="h-72 md:p-4 dark:bg-gray-900 flex items-center">
                  <DynamicChartBalance />
                </div>
              </div>
            </div>
            <div className="mb-8 block md:hidden">
              <DynamicAffiliateLinks />
            </div>
            <div
              className={`col-span-6 md:col-span-6 shadow overflow-hidden sm:rounded dark:border-gray-800 transition ${
                state.input.isLoading ? "opacity-10" : ""
              }`}
            >
              <DataTable />
            </div>
            <section className="mx-auto mt-8">
              <WhatIsLumpSum />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

const CoinWrapper = (props) => {
  return (
    <AppContextProvider
      availableTokens={props.availableTokens}
      chartData={props.chartData}
    >
      <div className="lg:flex bg-gray-100 dark:bg-gray-800">
        <div className="w-12/12 lg:w-330 md:border-r dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="w-full flex items-center justify-between px-4 h-16 border-b dark:border-gray-700">
            <Logo /> <ThemeSwitch />
          </div>
          <div>
            <InputFormLumpSum {...props} pathname="/lump-sum/" />
          </div>
          <div className="flex justify-center">
            <AdBannerMedium />
          </div>
          <div className="mt-0 md:mt-8 hidden md:block">
            <DynamicAffiliateLinks />
          </div>
        </div>
        <div className="w-12/12 mt-4 md:mt-0 md:p-8 flex-1">
          <Coin {...props} />
        </div>
      </div>
      <div className="border-t dark:border-gray-700">
        <Footer availableTokens={props.availableTokens} />
      </div>
    </AppContextProvider>
  );
};

export default CoinWrapper;
