import Head from "next/head";
import Navigation from "../../components/Navigarion/Navigation";
import InputFormWrapper from "../../components/InputForm/InputForm";
import Chart from "../../components/Chart/Chart";
import ChartBalance from "../../components/Chart/ChartBalance";
import { useAppContext } from "../../components/Context/Context";
import { formatPrice } from "../../components/Currency/Currency";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import DataTable from "../../components/DataTable/DataTable";
import AffiliateLinks from "../../components/AffiliateLinks/AffiliateLinks";
import { useCurrentCoin } from "../../components/Context/mainReducer";
import Information from "../../components/Information/Information";

dayjs.extend(duration);
dayjs.extend(relativeTime);
export default function Coin(props) {
  const { state } = useAppContext();
  const currentCoin = useCurrentCoin();
  const coinSymbol = currentCoin.symbol.toUpperCase();

  const costAverage =
    state.chart.data[state.chart.data.length - 1]?.costAverage;

  const earnings = state.chart.insights.totalValue?.fiat || 0;

  const currency = state.settings.currency;

  const priceChartMessage = `Investing ${formatPrice(
    state.input.investment || 0,
    currency
  )} in ${coinSymbol} from ${new Date(
    state.input.dateFrom
  ).toLocaleDateString()} every ${
    state.input.investmentInterval
  } days (${formatPrice(
    state.chart.insights.totalInvestment || 0,
    currency
  )} in total) would result in ${formatPrice(earnings, currency)} of ${
    earnings > 0 ? "value" : "loss"
  }!\rAverage price of ${formatPrice(
    costAverage,
    currency
  )} per 1${coinSymbol}.\r${
    state.chart.insights.percentageChange > 0
      ? `+${state.chart.insights.percentageChange}% gain!`
      : state.chart.insights.percentageChange
  }`;

  return (
    <div className="w-full">
      <Head>
        <title>
          DCA Crypto - Dollar cost average {currentCoin.name} ({coinSymbol})
          backtesting
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main>
        <div className="grid grid-cols-6 w-full gap-8 p-0 sm:p-8 bg-white dark:bg-gray-900">
          <div className="col-span-6">
            <div className="flex">
              <h1 className="text-2xl px-4 sm:px-0 text-gray-900 dark:text-gray-100">
                Dollar-cost averaging (DCA) calculator for{" "}
                <span className="text-indigo-700 dark:text-yellow-500 capitalize">
                  {currentCoin.name} ({coinSymbol})
                </span>{" "}
                backtesting
              </h1>
              <img
                className="w-8 h-8 ml-2 hidden sm:block"
                src={currentCoin.image}
              />
            </div>
          </div>
          <div className="col-span-6 xl:col-span-2">
            <div>
              <InputFormWrapper {...props} />
            </div>
            <div className="mt-8">
              <AffiliateLinks />
            </div>
          </div>
          <div className="col-span-6 xl:col-span-4">
            <div className="shadow border sm:rounded dark:border-gray-700">
              <div className="px-4 py-5 sm:px-6 dark:bg-gray-900">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Price development of {coinSymbol}
                </h3>
                <div className="">
                  <p className="mt-1 text-sm text-gray-500 dark:text-white">
                    {priceChartMessage}
                  </p>
                  <div className="flex justify-end mt-2">
                    <a
                      target="_blank"
                      rel="canonical"
                      data-size="large"
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        priceChartMessage
                      )}&url=${encodeURIComponent(
                        location.href
                      )}&hashtags=${coinSymbol},${currentCoin.name}`}
                      className="flex items-center justify-between transition rounded bg-white hover:bg-indigo-50 dark:bg-gray-900 dark:hover:bg-gray-800 py-1 px-2 text-indigo-700 dark:text-yellow-500 font-medium border shadow border-transparent"
                    >
                      Tweet
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="h-96 p-4 dark:bg-gray-900 flex items-center">
                <Chart />
              </div>
            </div>
            <div className="grid gap-8 mt-8 grid-cols-6">
              <div className="col-span-6 md:col-span-3 shadow sm:rounded border dark:border-gray-700">
                <Information />
              </div>
              <div className="col-span-6 md:col-span-3 shadow overflow-hidden sm:rounded border dark:border-gray-700">
                <div className="px-4 py-5 sm:px-6 dark:bg-gray-900">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Balance of your asset valuation
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-white">
                    Estimate the development of your earnings over time
                  </p>
                </div>
                <div className="h-80 p-4 dark:bg-gray-900 flex items-center">
                  <ChartBalance />
                </div>
              </div>
            </div>
            <div className="col-span-6 mt-8 md:col-span-6 shadow overflow-hidden sm:rounded border dark:border-gray-700">
              <DataTable />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-100 flex border-t h-20 justify-center items-center bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
        DCA CC - Dollar Cost Averaging Cryptocurrency
      </footer>
    </div>
  );
}

Coin.getInitialProps = (ctx) => {
  const { coin, investment, investmentInterval, dateFrom, dateTo } = ctx.query;
  return { coinId: coin, investment, investmentInterval, dateFrom, dateTo };
};
