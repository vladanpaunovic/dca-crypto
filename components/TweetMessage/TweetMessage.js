import { useAppContext } from "../Context/Context";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { formatPrice } from "../Currency/Currency";
import { useCurrentCoin } from "../Context/mainReducer";
import React from "react";
import ShareChart from "../ShareChart/ShareChart";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const useTweetMessage = () => {
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
  )} in ${coinSymbol} from ${dayjs(state.input.dateFrom).format(
    "MMM YYYY"
  )} to ${dayjs(state.input.dateTo).format("MMM YYYY")} every ${
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
      ? `+${state.chart.insights.percentageChange}%!`
      : state.chart.insights.percentageChange
  }`;

  return priceChartMessage;
};

export const TweetMessage = () => {
  const priceChartMessage = useTweetMessage();

  return (
    <div>
      <p className="mt-1 text-sm text-gray-500 dark:text-white">
        {priceChartMessage}
      </p>
      <div className="flex justify-end mt-2">
        <ShareChart />
      </div>
    </div>
  );
};
