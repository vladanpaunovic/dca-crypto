import Head from "next/head";
import Navigation from "../../components/Navigarion/Navigation";
import InputFormWrapper from "../../components/InputForm/InputForm";
import Chart from "../../components/Chart/Chart";
import ChartBalance from "../../components/Chart/ChartBalance";
import { AppContextProvider } from "../../components/Context/Context";
import DataTable from "../../components/DataTable/DataTable";
import AffiliateLinks from "../../components/AffiliateLinks/AffiliateLinks";
import Information from "../../components/Information/Information";
import { getAllCoins } from "../../queries/queries";
import { defaultCurrency } from "../../config";
import { useCurrentCoin } from "../../components/Context/mainReducer";
import { TweetMessage } from "../../components/TweetMessage/TweetMessage";

export async function getServerSideProps(context) {
  const {
    coin,
    investment,
    investmentInterval,
    dateFrom,
    dateTo,
  } = context.query;
  const availableTokens = await getAllCoins(
    context.query.currency || defaultCurrency
  );

  return {
    props: {
      availableTokens,
      coinId: coin,
      investment: investment || null,
      investmentInterval: investmentInterval || null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    },
  };
}

const Coin = (props) => {
  const currentCoin = useCurrentCoin();
  const coinSymbol = currentCoin.symbol.toUpperCase();

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
                <TweetMessage />
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
                <div className="h-72 p-4 dark:bg-gray-900 flex items-center">
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
};

const CoinWrapper = (props) => {
  return (
    <AppContextProvider availableTokens={props.availableTokens}>
      <Coin {...props} />
    </AppContextProvider>
  );
};

export default CoinWrapper;
