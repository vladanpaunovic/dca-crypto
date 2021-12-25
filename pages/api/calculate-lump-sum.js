import axios from "axios";
import dayjs from "dayjs";
import getPercentageChange from "../../components/helpers/getPercentageChange";
import { withSentry, addBreadcrumb, Severity } from "@sentry/nextjs";

const convertDateStringToUnix = (dateString) =>
  Math.round(new Date(dateString).getTime() / 1000);

const handler = async (req, res) => {
  const payload = { ...req.body };

  addBreadcrumb({
    category: "Payload",
    level: Severity.Info,
    message: "Lump Sum Payload",
    data: payload,
  });

  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${payload.coinId}/market_chart/range`,
    {
      params: {
        vs_currency: payload.currency,
        from: convertDateStringToUnix(payload.dateFrom),
        to: convertDateStringToUnix(Date.now()),
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

    const isNth = index % 7 === 0;
    if (isNth) {
      // Make sure there are no duplicates
      if (prev.find((e) => e.date === current.date)) {
        return prev;
      }

      return [...prev, current];
    }

    return prev;
  }, []);

  const firstInvestment = reduced[0];

  const chartData = reduced.map((entry, index) => {
    const costAverage = firstInvestment.coinPrice;

    const totalCrypto = payload.investment / firstInvestment.coinPrice;

    const balanceCrypto = payload.investment / firstInvestment.coinPrice;

    const totalFIAT = payload.investment;
    const balanceFIAT = (balanceCrypto * entry.coinPrice).toFixed(2);

    const percentageChange = getPercentageChange(totalFIAT, balanceFIAT);

    return {
      ...entry,
      totalFIAT: payload.investment,
      totalCrypto,
      costAverage,
      balanceFIAT,
      balanceCrypto,
      percentageChange,
    };
  });

  const mostRecentEntry = chartData[chartData.length - 1];

  const totalInvestment = mostRecentEntry.totalFIAT;
  const totalValueFIAT = mostRecentEntry.balanceFIAT;
  const percentageChange = mostRecentEntry.percentageChange;
  const totalValueCrypto = mostRecentEntry.balanceCrypto;

  const output = {
    chartData,
    insights: {
      totalInvestment,
      totalValue: { crypto: totalValueCrypto, fiat: totalValueFIAT },
      percentageChange,
      duration: dayjs(payload.dateTo).diff(payload.dateFrom),
      opportunityCost: chartData[0].balanceCrypto * mostRecentEntry.coinPrice,
    },
  };

  res.status(200).json(output);
};

export default withSentry(handler);
