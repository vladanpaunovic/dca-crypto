import InputFormWrapper from "../../components/InputForm/InputForm";
import {
  AppContextProvider,
  useAppContext,
} from "../../components/Context/Context";
import DataTable from "../../components/DataTable/DataTable";
import Information from "../../components/Information/Information";
import {
  getAllCoins,
  getCoinById,
  getDCAChartData,
} from "../../queries/queries";
import {
  CACHE_INVALIDATION_INTERVAL,
  defaultCurrency,
  WEBSITE_URL,
} from "../../config";
import Footer from "../../components/Footer/Footer";
import Logo from "../../components/Logo/Logo";
import ThemeSwitch from "../../components/ThemeSwitch/ThemeSwitch";
import { generateDefaultInput } from "../../common/generateDefaultInput";
import { NextSeo } from "next-seo";
import BreadcrumbDCA from "../../components/Breadcrumb/BreadcrumbDCA";
import WhatIsDCA from "../../components/LandingPage/WhatIsDCA";
import dynamic from "next/dynamic";
import Loading from "../../components/Loading/Loading";
import { AdBannerBig, AdBannerMedium } from "../../components/Ads/Ads";
import NextImage from "next/image";
import { formatPrice } from "../../components/Currency/Currency";
import { TweetMessage } from "../../components/TweetMessage/TweetMessage";
import dayjs from "dayjs";
import Navigation from "../../components/Navigarion/Navigation";

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

  const [availableTokens, chartData, currentCoin] = await Promise.all([
    getAllCoins(currency), // TODO: REMOVE
    getDCAChartData(payload),
    getCoinById(payload.coinId),
  ]);

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
  );

  return {
    props: {
      availableTokens,
      chartData,
      currentCoin,
      ...payload,
    },
  };
}

const Coin = () => {
  const { state } = useAppContext();

  if (!state.currentCoin) {
    return null;
  }

  const coinSymbol = state.currentCoin.symbol.toUpperCase();

  return (
    <div className="w-full">
      <NextSeo
        title={`Dollar cost average ${state.currentCoin.name} (${coinSymbol}) calculator`}
        description={`Visualise and calculate historical returns of investing ${formatPrice(
          state.input.investment
        )} in ${state.currentCoin.name} (${coinSymbol}) every ${
          state.input.investmentInterval
        } days from ${dayjs(state.input.dateFrom).format(
          "MMM YYYY"
        )} until now. See it on charts!`}
        canonical={`https://${WEBSITE_URL}/dca/${state.currentCoin.id}`}
        openGraph={{
          title: `Dollar cost average ${coinSymbol} calculator`,
          description: `Visualise and calculate historical returns of investing ${formatPrice(
            state.input.investment
          )} in ${coinSymbol} every ${
            state.input.investmentInterval
          } days from ${dayjs(state.input.dateFrom).format(
            "MMM YYYY"
          )} until now. See it on charts!`,
          images: [
            {
              url: `https://${WEBSITE_URL}/images/meta-open-graph-dca.jpg`,
              width: 1200,
              height: 697,
              alt: "Dollar cost averaging calculator",
            },
          ],
        }}
      />
      <main>
        <div className="grid grid-cols-6 w-full gap-8">
          <div className="col-span-6">
            <div className="flex items-center">
              <h1 className="h1-title">
                Dollar-cost averaging (DCA) calculator for{" "}
                <span className="text-indigo-700 dark:text-yellow-500 capitalize">
                  {state.currentCoin.name} ({coinSymbol})
                </span>{" "}
                backtesting
              </h1>
              {state.input.isLoading ? null : (
                <div className="w-8 h-8 ml-2 hidden sm:block relative">
                  <NextImage
                    src={state.currentCoin.image}
                    alt={`${state.currentCoin.name} logo`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="col-span-6">
            <BreadcrumbDCA
              name={state.currentCoin.name}
              coinId={state.currentCoin.id}
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
            <div className="hidden lg:flex justify-center my-4">
              <AdBannerBig />
            </div>
            <div className="flex lg:hidden justify-center my-4">
              <AdBannerMedium />
            </div>
            <section className="mx-auto mt-8">
              <WhatIsDCA />
            </section>
            <div className="hidden lg:flex justify-center my-4">
              <AdBannerBig />
            </div>
            <div className="flex lg:hidden justify-center my-4">
              <AdBannerMedium />
            </div>
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
      currentCoin={props.currentCoin}
    >
      <Navigation />

      <div className="lg:flex bg-gray-100 dark:bg-gray-800">
        <div className="w-12/12 lg:w-330 md:border-r dark:border-gray-700 bg-white dark:bg-gray-900">
          <div>
            <InputFormWrapper {...props} pathname="/dca/" />
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
