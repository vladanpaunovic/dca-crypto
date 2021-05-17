import Link from "next/link";
import { formatCurrency } from "@coingecko/cryptoformat";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatPrice } from "../Currency/Currency";
import { ExternalLinkIcon } from "@heroicons/react/outline";

const chartData = [
  {
    price: 9662.71,
    averagePrice: 8610,
  },
  {
    price: 9185.17,
    averagePrice: 9136,
  },
  {
    price: 11093.61,
    averagePrice: 9152,
  },
  {
    price: 11519.12,
    averagePrice: 9638,
  },
  {
    price: 10765.3,
    averagePrice: 10014,
  },
  {
    price: 13655.19,
    averagePrice: 10139,
  },
  {
    price: 17138.03,
    averagePrice: 10141,
  },
  {
    price: 26476.13,
    averagePrice: 11453,
  },
  {
    price: 32375.32,
    averagePrice: 13122,
  },
  {
    price: 49849.38,
    averagePrice: 15048,
  },
  {
    price: 55033.1,
    averagePrice: 18211,
  },
  {
    price: 48981.44,
    averagePrice: 21280,
  },
];

const annualGains = [
  {
    coin: "Bitcoin",
    url:
      "/dca/bitcoin?investmentInterval=7&investment=50&dateFrom=2020-01-01&dateTo=2021-01-01&currency=usd",
    percentageChange: 270,
    qty: 0.166821,
    symbol: "BTC",
  },
  {
    coin: "Ethereum",
    url:
      "/dca/ethereum?investmentInterval=7&investment=50&dateFrom=2020-01-01&dateTo=2021-01-01&currency=usd",
    percentageChange: 748,
    qty: 5.744257,
    symbol: "ETH",
  },
  {
    coin: "Binance Coin",
    url:
      "/dca/binancecoin?investmentInterval=7&investment=50&dateFrom=2020-01-01&dateTo=2021-01-01&currency=usd",
    percentageChange: 1985,
    qty: 85.69,
    symbol: "BNB",
  },
  {
    coin: "Cardano",
    url:
      "/dca/cardano?investmentInterval=7&investment=50&dateFrom=2020-01-01&dateTo=2021-01-01&currency=usd",
    percentageChange: 1033,
    qty: 18589.83,
    symbol: "ADA",
  },
  {
    coin: "XRP",
    url:
      "/dca/ripple?investmentInterval=7&investment=50&dateFrom=2020-01-01&dateTo=2021-01-01&currency=usd",
    percentageChange: 413,
    qty: 8694.54,
    symbol: "XRP",
  },
  {
    coin: "Dogecoin",
    url:
      "/dca/dogecoin?investmentInterval=7&investment=50&dateFrom=2020-01-01&dateTo=2021-01-01&currency=usd",
    percentageChange: 14624,
    qty: 615811.33,
    symbol: "DOGE",
  },
];

const Chart = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <defs>
            <linearGradient id="colorBalanceCrypto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBalanceFIAT" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="price"
            stroke="#F59E0B"
            fillOpacity={0}
            strokeWidth={2}
            name="Asset price"
          />
          <Area
            type="monotone"
            dataKey="averagePrice"
            stroke="#82ca9d"
            fillOpacity={0}
            strokeWidth={2}
            fill="url(#colorBalanceCrypto)"
            name="Average price using DCA"
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />

          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const WhatIsDCA = () => {
  return (
    <div className="py-32">
      <div className="container mx-auto max-w-7xl px-6 p-6 flex flex-col md:flex-row">
        <div className="w-4/4 md:w-2/4 gap-8 dark:text-white  md:pr-8">
          <Chart />
        </div>
        <div className="w-4/4 md:w-2/4 pl-4 md:pl-0">
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
              rel="nofollow"
              className="underline"
            >
              investopedia
            </a>
            ).
          </p>
        </div>
      </div>
      <div className="flex justify-center py-52">
        <div className="text-center">
          <p className="text-3xl sm:text-4xl tracking-tight font-bold text-gray-900 dark:text-gray-100 max-w-4xl mb-2">
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
            .
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

      <div className="">
        <div className="container mx-auto max-w-7xl px-6 p-6 bg-white dark:bg-gray-900 flex flex-col md:flex-row">
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
                  className="bg-white shadow rounded-lg dark:bg-gray-900 border overflow-hidden w-full relative  dark:border-gray-800 group"
                >
                  <img
                    src={`https://img.clankapp.com/symbol/${coin.symbol.toLowerCase()}.svg`}
                    alt={`${coin.coin} logo`}
                    className="h-24 w-24 rounded-full absolute -top-6 -right-6 md:-right-4"
                  />
                  <div className="px-4 py-5 ">
                    <dl>
                      <dt className="text-xl leading-5 font-medium text-gray-500 dark:text-gray-300 truncate">
                        {coin.coin}
                      </dt>
                      <dd className="mt-1 text-3xl leading-9 font-semibold text-green-400">
                        +{coin.percentageChange}%
                      </dd>
                      <dd className="text-gray-500 font-semibold dark:text-gray-300">
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

export default WhatIsDCA;
