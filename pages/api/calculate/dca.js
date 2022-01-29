import axios from "axios";
import dayjs from "dayjs";
import getPercentageChange from "../../../components/helpers/getPercentageChange";
import * as Sentry from "@sentry/nextjs";
import { checkCORS } from "../../../server/cors";

const convertDateStringToUnix = (dateString) =>
  new Date(dateString).getTime() / 1000;

const handler = async (req, res) => {
  await checkCORS(req, res);

  const payload = { ...req.body };

  Sentry.setContext("Payload", payload);

  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${payload.coinId}/market_chart/range`,
    {
      params: {
        from: convertDateStringToUnix(payload.dateFrom),
        to: convertDateStringToUnix(payload.dateTo),
        vs_currency: payload.currency,
      },
    }
  );

  if (!response.data.prices) {
    throw new Error("No data received from the CoinGecko");
  }

  const data = response.data.prices.map((entry) => ({
    date: new Date(entry[0]).toLocaleDateString(),
    coinPrice: parseFloat(entry[1]).toFixed(6),
  }));

  const reduced = data.reduce((prev, current, index) => {
    if (index === 0) {
      return [current];
    }

    const isNth = index % parseInt(payload.investmentInterval) === 0;
    if (isNth) {
      // Make sure there are no duplicates
      if (prev.find((e) => e.date === current.date)) {
        return prev;
      }

      return [...prev, current];
    }

    return prev;
  }, []);

  let allCrypto = [];
  let prices = [];

  const chartData = reduced.map((entry, index) => {
    prices.push(parseFloat(entry.coinPrice));
    const cryptoAmountInThisPurchase =
      payload.investment / parseFloat(entry.coinPrice);

    allCrypto.push(cryptoAmountInThisPurchase);
    const balanceCrypto = allCrypto.reduce((p, c) => p + c, 0);

    const totalFIAT = (index + 1) * payload.investment;

    const costAverage = totalFIAT / balanceCrypto;

    const balanceFIAT = (balanceCrypto * entry.coinPrice).toFixed(2);

    const percentageChange = getPercentageChange(totalFIAT, balanceFIAT);

    return {
      ...entry,
      totalFIAT,
      totalCrypto: cryptoAmountInThisPurchase,
      costAverage,
      balanceFIAT,
      balanceCrypto,
      percentageChange,
    };
  });

  const lastItem = chartData[chartData.length - 1];
  const { balanceFIAT, balanceCrypto, percentageChange, coinPrice } = lastItem;

  const output = {
    chartData,
    insights: {
      totalInvestment: lastItem.totalFIAT || payload.investment,
      totalValue: { crypto: balanceCrypto.toFixed(6), fiat: balanceFIAT },
      percentageChange,
      duration: dayjs(payload.dateTo).diff(payload.dateFrom),
      opportunityCost: chartData[0].balanceCrypto * coinPrice,
      lumpSum: (payload.investment / chartData[0].coinPrice) * coinPrice,
    },
  };

  res.status(200).json(output);
};

export default Sentry.withSentry(handler);
