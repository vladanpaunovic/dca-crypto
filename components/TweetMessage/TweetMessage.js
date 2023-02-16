import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { formatPrice } from "../Currency/Currency";
import React from "react";
import ShareChart from "../ShareChart/ShareChart";
import { useRouter } from "next/router";
import { useAppState } from "../../src/store/store";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const useTweetMessage = (props) => {
  const state = useAppState();
  const router = useRouter();

  let isDca = router.pathname.includes("dca");
  let chartData = state.chart.dca.chartData;
  let chartInsights = state.chart.dca.insights;
  let investment = state.input.investment || 0;
  let costAverage = chartData[chartData.length - 1]["Average cost"];

  if (props?.isLumpSum) {
    isDca = false;

    if (!props.chartData) {
      throw new Error("chartData missing");
    }

    chartData = state.chart.lumpSum.chartData;
    chartInsights = state.chart.lumpSum.insights;
    investment =
      state.chart.dca.chartData.length *
      parseFloat(state.chart.input.investment);
    costAverage = chartData[0].coinPrice;
  }

  const coinSymbol = state.currentCoin.symbol.toUpperCase();

  const earnings = chartInsights.totalValue?.fiat || 0;
  const currency = state.settings.currency;

  const priceChartMessageDca = `Investing ${formatPrice(
    investment,
    currency
  )} in ${coinSymbol} from ${dayjs(state.input.dateFrom).format(
    "MMM YYYY"
  )} to ${dayjs(state.input.dateTo).format("MMM YYYY")} every ${
    state.input.investmentInterval
  } days (${formatPrice(
    chartInsights.totalInvestment || 0,
    currency
  )} in total) would result in ${formatPrice(earnings, currency)} of ${
    earnings > 0 ? "value" : "loss"
  }!\rAverage price of ${formatPrice(
    costAverage,
    currency
  )} per 1${coinSymbol}.\r${
    chartInsights.percentageChange > 0
      ? `+${chartInsights.percentageChange}%!`
      : `${chartInsights.percentageChange}%`
  }`;

  const priceChartMessageLumpSum = `Investing ${formatPrice(
    investment,
    currency
  )} in ${coinSymbol} on ${dayjs(state.input.dateFrom).format(
    "MMM YYYY"
  )} would result in ${formatPrice(
    earnings,
    currency
  )} today!\rBought for ${formatPrice(
    costAverage,
    currency
  )} per 1${coinSymbol}.\r${
    chartInsights.percentageChange > 0
      ? `+${chartInsights.percentageChange}%!`
      : `${chartInsights.percentageChange}%`
  }`;

  return isDca ? priceChartMessageDca : priceChartMessageLumpSum;
};

export const TweetMessage = () => {
  const priceChartMessage = useTweetMessage();

  return (
    <div className="">
      <p className="mt-1 text-sm text-gray-500">{priceChartMessage}</p>
      <div className="flex justify-end mt-2 py-4 md:py-0">
        <ShareChart />
      </div>
    </div>
  );
};
