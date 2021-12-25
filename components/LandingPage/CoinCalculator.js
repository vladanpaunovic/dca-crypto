import { ChartSquareBarIcon, ChevronDownIcon } from "@heroicons/react/solid";
import AutosizeInput from "react-input-autosize";
import React, { useState } from "react";
import { defaultCurrency, WEBSITE_URL } from "../../config";
import queryString from "query-string";
import Link from "next/link";
import { generateDefaultInput } from "../../common/generateDefaultInput";
import { useQuery } from "react-query";
import { getDCAChartData } from "../../queries/queries";
import dayjs from "dayjs";
import { formatPrice } from "../Currency/Currency";
import * as ga from "../helpers/GoogleAnalytics";
import { AdBannerBig, AdBannerMedium } from "../Ads/Ads";

const hideSelectStyles = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  opacity: "0",
};

export const availableInvestmentIntervals = [
  { label: "day", value: "1" },
  { label: "week", value: "7" },
  { label: "second week", value: "14" },
  { label: "month", value: "30" },
  { label: "year", value: "365" },
];

export default function CoinCalculator(props) {
  const top20Tokens = [...props.availableTokens.slice(0, 20)];
  const [investment, setInvestment] = useState(10);
  const [years, setYears] = useState(5);
  const [interval, setInterval] = useState(availableInvestmentIntervals[1]);
  const [selectedCoin, setSelectedCoin] = useState(top20Tokens[0]);
  const today = dayjs().format("YYYY-MM-DD");
  const beforeNYears = dayjs(today)
    .subtract(years, "year")
    .format("YYYY-MM-DD");

  const { data } = useQuery({
    queryKey: ["getDCAChartData", investment, years, interval, selectedCoin],
    queryFn: async () => {
      if (!selectedCoin.id || !interval.value || !investment || !years) {
        return props.chartData;
      }

      const payload = generateDefaultInput({
        coin: selectedCoin.id,
        investmentInterval: interval.value,
        investment: investment || 10,
        dateFrom: beforeNYears,
        dateTo: today,
      });

      return await getDCAChartData(payload);
    },
    initialData: props.chartData,
  });

  const qs = queryString.stringify({
    investment,
    investmentInterval: interval.value,
    dateFrom: beforeNYears,
    dateTo: today,
    currency: defaultCurrency,
  });
  const chartUrl = `/dca/${selectedCoin.id}/?${qs}`;

  const tweetMessage = `If you'd bought ${formatPrice(investment)} of #${
    selectedCoin.name
  } every ${
    interval.label
  } for the last ${years} years, you'd have spent ${formatPrice(
    data.insights.totalInvestment
  )}. Today, you would have ${formatPrice(
    data.insights.totalValue.fiat
  )} worth of #${selectedCoin.name}`;

  const tweet = {
    label: "Twitter",
    color: "#55acee",
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetMessage
    )}&url=${encodeURIComponent(
      `https://${WEBSITE_URL}${chartUrl}`
    )}&hashtags=${selectedCoin.symbol},${selectedCoin.name}`,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
      </svg>
    ),
  };

  return (
    <div className="px-8 md:px-0">
      <div className="text-center shadow-2xl border dark:border-gray-700 rounded-3xl p-4">
        <h2 className="landing-choose-coin-title" aria-label={tweetMessage}>
          If you'd bought $
          <AutosizeInput
            className="flex items-center"
            value={investment}
            min={1}
            type="number"
            inputClassName="no_arrows px-0 landing-choose-coin-title landing-choose-coin-title__variable border-none underline dark:bg-gray-900"
            onChange={(event) => setInvestment(event.target.value)}
          />{" "}
          of{" "}
          <span className="relative landing-choose-coin-title__variable underline">
            #{selectedCoin.name}
            <select
              defaultValue={selectedCoin.id}
              onChange={(e) => {
                const currentCoin = top20Tokens.find(
                  (opt) => opt.id === e.target.value
                );
                if (currentCoin) {
                  setSelectedCoin(currentCoin);
                }
              }}
              style={hideSelectStyles}
            >
              {top20Tokens.map(({ id, name }, index) => (
                <option key={id} value={id}>
                  #{index + 1} {name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="landing-choose-coin-title__icon" />
          </span>
          every{" "}
          <span className="relative landing-choose-coin-title__variable underline">
            {interval.label}
            <select
              defaultValue={interval.value}
              onChange={(e) => {
                const intervalOption = availableInvestmentIntervals.find(
                  (opt) => opt.value === e.target.value
                );
                if (intervalOption) {
                  setInterval(intervalOption);
                }
              }}
              style={hideSelectStyles}
            >
              {availableInvestmentIntervals.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="landing-choose-coin-title__icon" />
          </span>
          for the last{" "}
          <AutosizeInput
            className="flex items-center"
            value={years}
            type="number"
            inputClassName="no_arrows px-0 landing-choose-coin-title landing-choose-coin-title__variable border-none underline dark:bg-gray-900"
            onChange={(event) => setYears(event.target.value)}
          />
          years, you'd have spent{" "}
          <span className="landing-choose-coin-title__variable cursor-auto text-gray-900 dark:text-gray-100">
            {formatPrice(data.insights.totalInvestment)}
          </span>
        </h2>
        <h2 className="landing-choose-coin-title mt-8">
          Today, you would have{" "}
          <span className="landing-choose-coin-title__variable cursor-auto text-gray-900 dark:text-gray-100">
            {formatPrice(data.insights.totalValue.fiat)}
          </span>{" "}
          worth of{" "}
          <span className="landing-choose-coin-title__variable cursor-auto text-gray-900 dark:text-gray-100">
            #{selectedCoin.name}
          </span>
        </h2>

        <div className="text-center mt-16 space-x-6">
          <Link href={tweet.href}>
            <a
              className="btn-blue inline-flex items-center"
              style={{ backgroundColor: tweet.color }}
              rel="nofollow noreferrer"
              target="_blank"
              onClick={() => {
                ga.event({
                  action: "share_homepage",
                  params: { token: selectedCoin.name },
                });
              }}
            >
              Tweet this <span className="ml-1 fill-current">{tweet.icon}</span>
            </a>
          </Link>
          <Link href={chartUrl}>
            <a
              onClick={() => {
                ga.event({
                  action: "see_details_homepage",
                  params: { token: selectedCoin.name },
                });
              }}
              className="btn-blue bg-indigo-500 inline-flex items-center"
            >
              See details <ChartSquareBarIcon className="w-6 h-6 ml-1" />
            </a>
          </Link>
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
      <div className="mt-10 max-w-2xl mx-auto">
        <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4 mt-8">
          What is dollar cost averaging (DCA)?
        </h2>
        <div className="pb-4">
          <p className="text-xl text-gray-700 dark:text-gray-200">
            Dollar cost averaging (DCA) is a strategy many investors use, where
            people invests a fixed amount of money over fixed time intervals,
            such as every week or every month, without checking prices and
            stress.
          </p>
          <p className="text-xl text-gray-700 dark:text-gray-200">
            Dollar cost averaging is mostly used by people who are looking to
            invest in {selectedCoin.name} for the long-term, since it protects
            them from potentially allocating all their capital at once.
          </p>
        </div>
        <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4 mt-8">
          How dollar cost averageing works (with an example)?
        </h2>

        <div className="space-y-4 pb-4">
          <p className="text-xl text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide ">
            Meet Patricia 💃
          </p>
          <p className="text-xl text-gray-700 dark:text-gray-200">
            Patricia decided {years} years ago, to start investing{" "}
            {formatPrice(investment)} in #{selectedCoin.name} every{" "}
            {interval.label}.
          </p>
          <p className="text-xl text-gray-700 dark:text-gray-200">
            During this period Patricia would have invested{"  "}
            {formatPrice(data.insights.totalInvestment)} of her own money.
          </p>
          <p className="text-xl text-gray-700 dark:text-gray-200">
            If we sum up that all together, today Patricia's investment would be
            worth {formatPrice(data.insights.totalValue.fiat)} of #
            {selectedCoin.name} converted to USD.
          </p>
        </div>
        <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4 mt-8">
          What is Lump sum investing?
        </h2>
        <div className="space-y-4 pb-4">
          <p className="text-xl text-gray-700 dark:text-gray-200">
            Unlike dollar cost averaging where investment is devided across time
            intervals, lump sum investing is an amount invested all at once.
          </p>
        </div>
        <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4 mt-8">
          How lump sum investing works (with an example)?
        </h2>
        <div className="space-y-4  pb-4">
          <p className="text-xl text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide">
            Meet Robert 👨‍⚕️
          </p>
          <p className="text-xl text-gray-700 dark:text-gray-200">
            Robert started investing {years} years ago, and at that time, Robert
            invested {formatPrice(investment)} in #{selectedCoin.name}. With the
            price development over this time period, Robert would have{" "}
            {formatPrice(data.insights.lumpSum)} worth #{selectedCoin.name}{" "}
            today.
          </p>
        </div>
      </div>
    </div>
  );
}
