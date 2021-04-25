import axios from "axios";
import dayjs from "dayjs";

const convertDateStringToUnix = (dateString) =>
  new Date(dateString).getTime() / 1000;

function getPercentageChange(oldNumber, newNumber) {
  var decreaseValue = newNumber - oldNumber;

  const output = (decreaseValue / oldNumber) * 100;
  return output.toFixed(2);
}

export default async (req, res) => {
  if (req.method === "POST") {
    // Process a POST request
    const payload = { ...req.body };

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${payload.coinId}/market_chart/range`,
      {
        params: {
          vs_currency: payload.currency,
          from: convertDateStringToUnix(payload.dateFrom),
          to: convertDateStringToUnix(payload.dateTo),
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

    const chartData = reduced.map((entry, index) => {
      const sumAllInvestments = reduced
        .slice(0, index)
        .map((e) => parseFloat(e.coinPrice))
        .reduce((prev, next) => prev + next, 0);

      const costAverage =
        index === 0 ? entry.coinPrice : (sumAllInvestments / index).toFixed(2);

      const totalCrypto = payload.investment / entry.coinPrice;

      const balanceCrypto = reduced
        .slice(0, index + 1)
        .map((e) => payload.investment / parseFloat(e.coinPrice))
        .reduce((prev, curr) => prev + curr, 0)
        .toFixed(6);

      const totalFIAT = (index + 1) * payload.investment;
      const balanceFIAT = (balanceCrypto * entry.coinPrice).toFixed(2);

      const percentageChange = getPercentageChange(totalFIAT, balanceFIAT);

      return {
        ...entry,
        totalFIAT: (index + 1) * payload.investment,
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
      },
    };

    res.status(200).json(output);
  } else {
    res.status(404);
  }
};
