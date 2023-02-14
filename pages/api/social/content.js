import { generateDefaultInput } from "../../../common/generateDefaultInput";
import { defaultCurrency, WEBSITE_URL } from "../../../config";
import { formatPrice } from "../../../components/Currency/Currency";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import queryString from "query-string";
import { checkCORS } from "../../../server/cors";
import { getCommonChartData } from "../../../server/serverQueries";
import { getGeneratedChartData } from "../../../src/calculations/utils";
import { getAllAvailableCoins } from "../../../src/vercelEdgeConfig/vercelEdgeConfig";
dayjs.extend(relativeTime);

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

const generateHookMessage = (charts, payload) => {
  const totalValue = {
    DCA: parseInt(charts.dca.insights.totalValue.fiat),
    LUMPSUM: parseInt(charts.lumpSum.insights.totalValue.fiat),
  };

  const relativeTimeAgo = dayjs().to(payload.dateFrom);

  if (totalValue.DCA > totalValue.LUMPSUM) {
    const difference = totalValue.DCA - totalValue.LUMPSUM;
    return `Are you regretting not investing in #${payload.coinName} ${relativeTimeAgo}? Don't make the same mistake twice. Learn how dollar-cost averaging (DCA) could've earned you $${difference} more than a lump-sum investment in the same time frame. #DCA #${payload.coinSymbol}`;
  }

  if (totalValue.DCA < totalValue.LUMPSUM) {
    const difference = totalValue.LUMPSUM - totalValue.DCA;
    return `This is how lump sum could beat DCA with #${payload.coinName}! In this example, lump sum investing could've earned you $${difference} more than a DCA investment in the same time frame. #lumpsum #${payload.coinSymbol}`;
  }
};

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

const generateSummaryMessage = (charts) => {
  const totalValue = {
    DCA: parseInt(charts.dca.insights.totalValue.fiat),
    LUMPSUM: parseInt(charts.lumpSum.insights.totalValue.fiat),
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
  await checkCORS(req, res);
  const availableTokens = await getAllAvailableCoins();

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

  const response = await getCommonChartData({
    ...payload,
    coinId: randomCoin.id,
  });

  const dcaChartData = getGeneratedChartData({
    data: response.prices,
    input: payload,
  });

  const tweetMessage = generateDCATweetMessage({
    coinName: randomCoin.name,
    coinSymbol: randomCoin.symbol.toUpperCase(),
    investment: payload.investment,
    intervalLabel: randomInterval.label,
    totalInvestment: dcaChartData.dca.insights.totalInvestment,
    totalValueFiat: dcaChartData.dca.insights.totalValue.fiat,
    years: randomYears,
  });

  const threadMessage = generateLumpSumTweetMessage({
    investment: dcaChartData.lumpSum.insights.totalInvestment,
    coinSymbol: randomCoin.symbol.toUpperCase(),
    coinName: randomCoin.name,
    earnings: dcaChartData.lumpSum.insights.totalValue?.fiat || 0,
    startPrice:
      dcaChartData.lumpSum.chartData[dcaChartData.lumpSum.chartData.length - 1][
        "Buying price"
      ],
    percentageChange: dcaChartData.lumpSum.insights.percentageChange,
    years: randomYears,
  });

  const dcaQueryString = queryString.stringify({
    investment: payload.investment,
    investmentInterval: randomInterval.value,
    dateFrom: beforeNYears,
    dateTo: today,
    currency: defaultCurrency,
  });

  const dcaChartUrl = `https://${WEBSITE_URL}/dca/${randomCoin.id}/?${dcaQueryString}`;

  const summaryMessage = generateSummaryMessage(dcaChartData);

  const hookMessage = generateHookMessage(dcaChartData, {
    dateFrom: beforeNYears,
    coinSymbol: randomCoin.symbol.toUpperCase(),
    coinName: randomCoin.name,
  });
  try {
    res.status(200).json({
      status: "ok",
      posts: [
        { message: hookMessage, url: null },
        { message: tweetMessage, url: dcaChartUrl },
        { message: threadMessage, url: null },
        {
          message: `${summaryMessage} #${randomCoin.symbol.toUpperCase()}`,
          url: null,
        },
      ],
      payload,
      coin: randomCoin,
      rawData: {
        dca: dcaChartData.dca,
        lumpSum: dcaChartData.lumpSum,
        coinName: randomCoin.name,
        coinSymbol: randomCoin.symbol.toUpperCase(),
        coinId: randomCoin.id,
        investment: payload.investment,
        intervalLabel: randomInterval.label,
        totalInvestment: dcaChartData.dca.insights.totalInvestment,
        totalValueFiat: dcaChartData.dca.insights.totalValue.fiat,
        years: randomYears,
        dcaPercentageChange: dcaChartData.lumpSum.insights.percentageChange,
      },
    });
  } catch (error) {
    res.status(200).json({ status: "error", ...error });
  }
}

export default handler;
