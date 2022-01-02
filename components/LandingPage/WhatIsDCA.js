import Link from "next/link";
import { formatCurrency } from "@coingecko/cryptoformat";
import { memo } from "react";
import { formatPrice } from "../Currency/Currency";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import dynamic from "next/dynamic";
import Loading from "../Loading/Loading";
import NextImage from "next/image";

const annualGains = [
  {
    coin: "Bitcoin",
    url: "/dca/bitcoin?investmentInterval=7&investment=50&dateFrom=2020-05-10&dateTo=2021-05-10&currency=usd",
    percentageChange: 270,
    qty: 0.166821,
    symbol: "BTC",
  },
  {
    coin: "Ethereum",
    url: "/dca/ethereum?investmentInterval=7&investment=50&dateFrom=2020-05-10&dateTo=2021-05-10&currency=usd",
    percentageChange: 748,
    qty: 5.744257,
    symbol: "ETH",
  },
  {
    coin: "Binance Coin",
    url: "/dca/binancecoin?investmentInterval=7&investment=50&dateFrom=2020-05-10&dateTo=2021-05-10&currency=usd",
    percentageChange: 1985,
    qty: 85.69,
    symbol: "BNB",
  },
  {
    coin: "Cardano",
    url: "/dca/cardano?investmentInterval=7&investment=50&dateFrom=2020-05-10&dateTo=2021-05-10&currency=usd",
    percentageChange: 1033,
    qty: 18589.83,
    symbol: "ADA",
  },
  {
    coin: "XRP",
    url: "/dca/ripple?investmentInterval=7&investment=50&dateFrom=2020-05-10&dateTo=2021-05-10&currency=usd",
    percentageChange: 413,
    qty: 8694.54,
    symbol: "XRP",
  },
  {
    coin: "Dogecoin",
    url: "/dca/dogecoin?investmentInterval=7&investment=50&dateFrom=2020-05-10&dateTo=2021-05-10&currency=usd",
    percentageChange: 14624,
    qty: 615811.33,
    symbol: "DOGE",
  },
];

const DynamicDCAChartTiming = dynamic(() => import("./DCAChartTiming"), {
  ssr: false,
  loading: () => <Loading withWrapper />,
});

const DynamicDCAChart = dynamic(() => import("./DCAChart"), {
  ssr: false,
  loading: () => <Loading withWrapper />,
});

const WhatIsDCA = () => {
  return (
    <div className="">
      <div className="container mx-auto max-w-7xl px-6 p-6 flex flex-col md:flex-row ">
        <div className="w-4/4 md:w-2/4">
          <DynamicDCAChart />
        </div>
        <div className="w-4/4 md:w-2/4 pl-4 md:pl-0 md:ml-8">
          <h2 className="text-base text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide uppercase">
            Dollar cost averaging
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight  sm:text-4xl">
            What is DCA?
          </p>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            Dollar cost averaging (DCA) is calmest investment strategy where
            person invests a fixed amount of money over given time intervals,
            such as after every paycheck or every week, without checking prices
            and stressing of pumps or dumps.
          </p>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            People choose this investment strategy when long term growth of an
            asset is foreseen (
            <a
              href="https://www.investopedia.com/terms/d/dollarcostaveraging.asp"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              investopedia
            </a>
            ).
          </p>
          <p className="mt-3 text-sm text-gray-400">
            Source: investing in Bitcoin from{" "}
            <Link href="/dca/bitcoin?investmentInterval=7&investment=50&dateFrom=2021-01-01&dateTo=2021-05-20&currency=usd">
              <a target="_blank" className="underline">
                January to May
              </a>
            </Link>{" "}
            in 2021.
          </p>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-6 p-6 flex flex-col md:flex-row ">
        <div className="w-4/4 md:w-2/4 pl-4 md:pl-0">
          <h2 className="text-base text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide uppercase">
            Timing
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight  sm:text-4xl">
            When should I start?
          </p>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            This is made to be simple and calm, remember? The rule of thumb here
            is - don&apos;t wait for any dips, just start. So, the simple answer
            is - now.
          </p>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            Even if price dumps in a meanwhile, historical data shows us that it
            will eventually rise (usually by a lot) which gives you a
            competetive adventage and lower average price.
          </p>
          <p className="mt-3 text-sm text-gray-400">
            Source: investing in Bitcoin{" "}
            <Link href="/dca/bitcoin?investmentInterval=30&investment=50&dateFrom=2020-01-01&dateTo=2021-01-01&currency=usd">
              <a target="_blank" className="underline">
                whole 2020
              </a>
            </Link>{" "}
            Vs. only the{" "}
            <Link href="/dca/bitcoin?investmentInterval=30&investment=50&dateFrom=2020-07-01&dateTo=2021-01-01&currency=usd">
              <a target="_blank" className="underline">
                second half
              </a>
            </Link>{" "}
            of 2020
          </p>
        </div>
        <div className="w-4/4 md:w-2/4 gap-8 dark:text-white  md:pr-8">
          <DynamicDCAChartTiming />
        </div>
      </div>
      <div className="flex justify-center py-16 md:py-24">
        <div className="text-center">
          <p className="text-3xl px-4 sm:text-4xl tracking-tight font-bold text-gray-900 dark:text-gray-100 max-w-4xl mb-2">
            People saving{" "}
            <span className="text-indigo-500 dark:text-yellow-500">
              {formatPrice(50)}
            </span>{" "}
            in Bitcoin per week, over the last three years turned{" "}
            <span className="text-indigo-500 dark:text-yellow-500">
              {formatPrice(8500)}
            </span>{" "}
            into{" "}
            <span className="text-indigo-500 dark:text-yellow-500">
              {formatPrice(60076)}
            </span>
          </p>
          <Link href="/dca/bitcoin?investmentInterval=7&investment=50&dateFrom=2018-01-01&dateTo=2021-04-01&currency=usd">
            <a
              className="text-sm w-full underline text-indigo-500 dark:text-yellow-500"
              target="_blank"
            >
              (source DCA calculator)
            </a>
          </Link>
        </div>
      </div>
      <div className=" pb-24">
        <div className="container mx-auto max-w-7xl px-6 p-6 flex flex-col md:flex-row">
          <div className="mb-16 w-3/3 md:w-1/3 pl-4 md:pl-0 md:pr-8">
            <h2 className="text-base text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide uppercase">
              Real examples
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Annual return dollar cost averaging {formatPrice(50)} a week
            </p>
          </div>
          <div className="grid grid-cols-2 w-3/3 md:w-2/3 gap-8 dark:text-white">
            {annualGains.map((coin) => (
              <Link key={coin.symbol} href={coin.url}>
                <a
                  target="_blank"
                  className="shadow rounded-lg col-span-2 md:col-span-1 overflow-hidden w-full relative border dark:border-gray-900 group"
                >
                  <div className="h-24 w-24 absolute -top-6 -right-6 md:-right-4 shadow-2xl rounded-full">
                    <NextImage
                      src={`https://img.clankapp.com/symbol/${coin.symbol.toLowerCase()}.svg`}
                      alt={`${coin.coin} logo`}
                      layout="fill" // required
                      objectFit="cover"
                    />
                  </div>
                  <div className="px-4 py-5 ">
                    <dl>
                      <dt className="text-xl leading-5 font-medium text-gray-900 dark:text-gray-300 truncate">
                        {coin.coin}
                      </dt>
                      <dd className="mt-1 text-3xl leading-9 font-semibold text-green-400">
                        +{coin.percentageChange}%
                      </dd>
                      <dd className="text-gray-700 font-semibold dark:text-gray-300">
                        <span>{formatCurrency(coin.qty, coin.symbol)}</span>
                      </dd>
                      <dd className="text-gray-500 flex items-center justify-end font-semibold dark:text-gray-300 text-right opacity-0 group-hover:opacity-100 transition-all">
                        Details <ExternalLinkIcon className="w-5 h-5 ml-1" />
                      </dd>
                    </dl>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(WhatIsDCA);
