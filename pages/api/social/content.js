import { withSentry } from "@sentry/nextjs";
import { generateDefaultInput } from "../../../common/generateDefaultInput";
import { defaultCurrency, WEBSITE_URL } from "../../../config";
import {
  getAllCoins,
  getDCAChartData,
  getLumpSumChartData,
} from "../../../queries/queries";
import { formatPrice } from "../../../components/Currency/Currency";
import dayjs from "dayjs";
import queryString from "query-string";

const randomArrayKey = (array) =>
  array[Math.floor(Math.random() * array.length)];

export const availableInvestmentIntervals = [
  { label: "day", value: "1" },
  { label: "week", value: "7" },
  { label: "second week", value: "14" },
  { label: "month", value: "30" },
  { label: "year", value: "365" },
];

const stableCoins = ["usdt", "usdc", "busd", "ust", "dai"];

const today = dayjs().format("YYYY-MM-DD");
const randomYears = randomArrayKey([1, 2, 3, 4, 5]);
const beforeNYears = dayjs(today)
  .subtract(randomYears, "year")
  .format("YYYY-MM-DD");

const generateDCATweetMessage = (payload) =>
  `If you'd bought ${formatPrice(payload.investment)} of #${
    payload.coinName
  } every ${payload.intervalLabel} for the last ${
    payload.years > 1 ? `${payload.years} years` : `${payload.years} year`
  }, you'd have spent ${formatPrice(
    payload.totalInvestment
  )}. Today, you would have ${formatPrice(payload.totalValueFiat)} worth in #${
    payload.coinSymbol
  }`;

const generateLumpSumTweetMessage = (payload) =>
  `Investing the same amount (${formatPrice(payload.investment || 0)}) in #${
    payload.coinName
  } ${
    payload.years > 1 ? `${payload.years} years` : `${payload.years} year`
  } ago at once (lump-sum), would result in ${formatPrice(
    payload.earnings
  )} today!\rBought for ${formatPrice(payload.startPrice)} per 1${
    payload.coinSymbol
  }.\r${
    payload.percentageChange > 0
      ? `+${payload.percentageChange}%!`
      : payload.percentageChange
  }`;

const generateSummaryMessage = (dca, lumpSum) => {
  const totalValue = {
    DCA: parseInt(dca.insights.totalValue.fiat),
    LUMPSUM: parseInt(lumpSum.insights.totalValue.fiat),
  };

  if (totalValue.DCA > totalValue.LUMPSUM) {
    const difference = totalValue.DCA - totalValue.LUMPSUM;
    return `Observing this scenario #DCA would be better investing strategy, overtaking #lumpsum investment by ${formatPrice(
      difference
    )}. #DCA`;
  }

  if (totalValue.DCA < totalValue.LUMPSUM) {
    const difference = totalValue.LUMPSUM - totalValue.DCA;
    return `Observing this scenario Lump-sum would be better investing strategy, overtaking #DCA by ${formatPrice(
      difference
    )}. #lumpsum`;
  }

  return "There are no differences in gain over this time period. Both strategies prove equal returns.";
};

async function handler(req, res) {
  const availableTokens = await getAllCoins(defaultCurrency);

  const filteredAvailableTokens = availableTokens.filter(
    (token) => !stableCoins.includes(token.symbol)
  );
  const topTenCoins = filteredAvailableTokens.slice(0, 9);
  const randomCoin = randomArrayKey(topTenCoins);
  const randomInterval = randomArrayKey(availableInvestmentIntervals);
  const payload = generateDefaultInput({
    coin: randomCoin.id,
    investmentInterval: randomInterval.value,
    investment: randomArrayKey([10, 50, 100]),
    dateFrom: beforeNYears,
    dateTo: today,
  });

  const dcaChartData = await getDCAChartData(payload);

  const tweetMessage = generateDCATweetMessage({
    coinName: randomCoin.name,
    coinSymbol: randomCoin.symbol.toUpperCase(),
    investment: payload.investment,
    intervalLabel: randomInterval.label,
    totalInvestment: dcaChartData.insights.totalInvestment,
    totalValueFiat: dcaChartData.insights.totalValue.fiat,
    years: randomYears,
  });

  const lumpSumChartData = await getLumpSumChartData({
    ...payload,
    investment: dcaChartData.insights.totalInvestment,
  });
  const threadMessage = generateLumpSumTweetMessage({
    investment: lumpSumChartData.insights.totalInvestment,
    coinSymbol: randomCoin.symbol.toUpperCase(),
    coinName: randomCoin.name,
    earnings: lumpSumChartData.insights.totalValue?.fiat || 0,
    startPrice:
      lumpSumChartData.chartData[lumpSumChartData.chartData.length - 1]
        ?.costAverage,
    percentageChange: lumpSumChartData.insights.percentageChange,
    years: randomYears,
  });

  const dcaQueryString = queryString.stringify({
    investment: payload.investment,
    investmentInterval: randomInterval.value,
    dateFrom: beforeNYears,
    dateTo: today,
    currency: defaultCurrency,
  });

  const lumpSumQueryString = queryString.stringify({
    investment: lumpSumChartData.insights.totalInvestment,
    investmentInterval: randomInterval.value,
    dateFrom: beforeNYears,
    currency: defaultCurrency,
  });

  const dcaChartUrl = `https://${WEBSITE_URL}/dca/${randomCoin.id}/?${dcaQueryString}`;
  const lumpSumChartUrl = `https://${WEBSITE_URL}/lump-sum/${randomCoin.id}/?${lumpSumQueryString}`;

  const summaryMessage = generateSummaryMessage(dcaChartData, lumpSumChartData);
  try {
    res.status(200).json({
      status: "ok",
      posts: [
        { message: tweetMessage, url: dcaChartUrl },
        { message: threadMessage, url: lumpSumChartUrl },
        {
          message: `${summaryMessage} #${randomCoin.symbol.toUpperCase()}`,
          url: null,
        },
      ],
    });
  } catch (error) {
    res.status(200).json({ status: "error", ...error });
  }
}

export default withSentry(handler);
