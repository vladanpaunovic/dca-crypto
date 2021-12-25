import { withSentry } from "@sentry/nextjs";
import Twitter from "twitter-lite";
import { generateDefaultInput } from "../../../common/generateDefaultInput";
import { defaultCurrency, WEBSITE_URL } from "../../../config";
import { getAllCoins, getDCAChartData } from "../../../queries/queries";
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

const generateTweetMessage = (payload) =>
  `If you'd bought ${formatPrice(payload.investment)} of #${
    payload.coinName
  } every ${payload.intervalLabel} for the last ${
    payload.years
  } years, you'd have spent ${formatPrice(
    payload.totalInvestment
  )}. Today, you would have ${formatPrice(payload.totalValueFiat)} worth of #${
    payload.coinName
  }`;

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

  const today = dayjs().format("YYYY-MM-DD");
  const randomYears = randomArrayKey([1, 2, 3, 4, 5]);
  const beforeNYears = dayjs(today)
    .subtract(randomYears, "year")
    .format("YYYY-MM-DD");

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

  const chartData = await getDCAChartData(payload);

  const tweetMessage = generateTweetMessage({
    coinName: randomCoin.name,
    investment: payload.investment,
    intervalLabel: randomInterval.label,
    totalInvestment: chartData.insights.totalInvestment,
    totalValueFiat: chartData.insights.totalValue.fiat,
    years: randomYears,
  });

  const qs = queryString.stringify({
    investment: payload.investment,
    investmentInterval: randomInterval.value,
    dateFrom: beforeNYears,
    dateTo: today,
    currency: defaultCurrency,
  });

  const chartUrl = `https://${WEBSITE_URL}/dca/${randomCoin.id}/?${qs}`;

  try {
    const response = await twitterClient.post("statuses/update", {
      status: `${tweetMessage} ${chartUrl}`,
      auto_populate_reply_metadata: true,
    });

    res.status(200).json({
      status: "ok",
      tweetMessage,
      chartUrl,
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: "error", ...error });
  }
}

export default withSentry(handler);
