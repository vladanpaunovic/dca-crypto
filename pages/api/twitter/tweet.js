import { withSentry } from "@sentry/nextjs";
import Twitter from "twitter-lite";
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
    return `Observing this scenario DCA is a better investing strategy, overtaking lump-investment by ${formatPrice(
      difference
    )}. #DCA`;
  }

  if (totalValue.DCA < totalValue.LUMPSUM) {
    const difference = totalValue.LUMPSUM - totalValue.DCA;
    return `Observing this scenario Lump-sum is a better investing strategy, overtaking DCA by ${formatPrice(
      difference
    )}. #lump-sum`;
  }

  return "There are no differences in gain over this time period. Both strategies prove equal returns.";
};

async function handler(req, res) {
  if (!req.body.consumer_key) {
    throw new Error("Missing consumer_key");
  }

  if (!req.body.consumer_secret) {
    throw new Error("Missing consumer_secret");
  }

  if (!req.body.access_token_key) {
    throw new Error("Missing access_token_key");
  }

  if (!req.body.access_token_secret) {
    throw new Error("Missing access_token_secret");
  }

  const twitterClient = new Twitter({
    consumer_key: req.body.consumer_key,
    consumer_secret: req.body.consumer_secret,
    access_token_key: req.body.access_token_key,
    access_token_secret: req.body.access_token_secret,
  });

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

  const qs = queryString.stringify({
    investment: payload.investment,
    investmentInterval: randomInterval.value,
    dateFrom: beforeNYears,
    dateTo: today,
    currency: defaultCurrency,
  });

  const dcaChartUrl = `https://${WEBSITE_URL}/dca/${randomCoin.id}/?${qs}`;
  const lumpSumChartUrl = `https://${WEBSITE_URL}/lump-sum/${randomCoin.id}/?${qs}`;

  const summaryMessage = generateSummaryMessage(dcaChartData, lumpSumChartData);
  try {
    const tweet = await twitterClient.post("statuses/update", {
      status: `${tweetMessage} ${dcaChartUrl}`,
      auto_populate_reply_metadata: true,
    });

    const tweetInThread = await twitterClient.post("statuses/update", {
      status: `${threadMessage} ${lumpSumChartUrl}`,
      in_reply_to_status_id: tweet.id_str,
      auto_populate_reply_metadata: true,
    });

    const tweetSummary = await twitterClient.post("statuses/update", {
      status: `${summaryMessage} #${randomCoin.symbol.toUpperCase()}`,
      in_reply_to_status_id: tweetInThread.id_str,
      auto_populate_reply_metadata: true,
    });

    res.status(200).json({
      status: "ok",
      tweetMessage,
      threadMessage,
      dcaChartUrl,
      lumpSumChartUrl,
      tweetSummary,
      tweet,
      tweetInThread,
      tweetSummary,
    });
  } catch (error) {
    res.status(200).json({ status: "error", ...error });
  }
}

export default withSentry(handler);
