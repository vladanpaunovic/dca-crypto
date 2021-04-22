import Head from "next/head";
import Navigation from "../../components/Navigarion/Navigation";
import InputFormWrapper from "../../components/InputForm/InputForm";
import Chart from "../../components/Chart/Chart";
import ChartBalance from "../../components/Chart/ChartBalance";
import { useAppContext } from "../../components/Context/Context";
import Currency from "../../components/Currency/Currency";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);
export default function Coin(props) {
  const { state } = useAppContext();

  const information = [
    {
      label: "Duration",
      value: `${state.input.duration} days (${dayjs
        .duration(state.input.duration, "days")
        .humanize()})`,
    },
    {
      label: "Total investment",
      value: <Currency value={state.chart.insights.totalInvestment || 0} />,
    },
    {
      label: "Value in FIAT",
      value: (
        <>
          <Currency value={state.chart.insights.totalValue?.fiat || 0} />{" "}
          <span
            className={`inline-block px-2 text-sm text-white dark:text-gray-900 ${
              state.chart.insights.percentageChange > 0
                ? "bg-green-400"
                : "bg-red-400"
            } rounded`}
          >
            {state.chart.insights.percentageChange > 0 ? "+" : ""}
            {state.chart.insights.percentageChange}%
          </span>
        </>
      ),
    },
    {
      label: "Value in crypto",
      value: (
        <>
          {state.chart.insights.totalValue?.crypto?.toFixed(6) || 0}{" "}
          <span className="font-bold">{state.input.coinSymbol}</span>
        </>
      ),
    },
  ];

  const allInformation = () => {
    const oddClass =
      "bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6";
    const evenClass =
      "bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6";
    return information.map((i, index) => (
      <div key={i.label} className={index % 2 === 0 ? evenClass : oddClass}>
        <dt className="text-sm font-medium text-gray-500 dark:text-white">
          {i.label}
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-white">
          {i.value}
        </dd>
      </div>
    ));
  };

  return (
    <div className="w-full">
      <Head>
        <title>
          DCA Crypto - Dollar cost average {state.input.coinName} (
          {state.input.coinSymbol})
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main>
        <div className="grid grid-cols-6 w-full gap-8 p-8 bg-white dark:bg-gray-900">
          <div className="col-span-6">
            <div className="flex">
              <h1 className="text-2xl text-gray-900 dark:text-gray-100">
                Dollar-cost averaging (DCA) calculator for{" "}
                <span className="text-indigo-700 dark:text-yellow-500 capitalize">
                  {state.input.coinName} ({state.input.coinSymbol})
                </span>
              </h1>
              <img className="w-8 h-8 ml-2 " src={state.input.coinImage} />
            </div>
          </div>
          <div className="col-span-1 ">
            <InputFormWrapper coin={props.coin} />
          </div>
          <div className="col-span-5 p-4 transition-shadow border dark:border-gray-800 rounded shadow-sm">
            <Chart />
          </div>
          <div className="col-span-1" />
          <div className="col-span-5 grid grid-cols-4 gap-10 ">
            <div className="col-span-2 shadow overflow-hidden rounded border dark:border-gray-800">
              <div className="px-4 py-5 sm:px-6 dark:bg-gray-900">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-white">
                  Summarised data regarding your investment.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-900">
                <dl>{allInformation()} </dl>
              </div>
            </div>

            <div className="col-span-2 p-4 transition-shadow border dark:border-gray-800 rounded shadow-sm hover:shadow-lg">
              <ChartBalance />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-100 flex border-t h-20 justify-center items-center dark:bg-gray-900 dark:text-gray-100 dark:border-gray-900">
        DCA CRYPTO
      </footer>
    </div>
  );
}

Coin.getInitialProps = (ctx) => {
  return { coin: ctx.query.coin };
};
