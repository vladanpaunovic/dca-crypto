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
      `https://api.coingecko.com/api/v3/coins/${payload.coindId}/market_chart/range`,
      {
        params: {
          vs_currency: "usd",
          from: convertDateStringToUnix(payload.dateFrom),
          to: convertDateStringToUnix(payload.dateTo),
        },
      }
    );

    if (!response.data.prices) {
      throw new Error("No data received from the CoinGecko");
    }

    const data = response.data.prices.map((entry) => ({
      date: dayjs(entry[0]).format("YYYY-MMM-D"),
      coinPrice: parseFloat(entry[1]).toFixed(2),
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

    // console.log(reduced);

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

      const balanceFIAT = (balanceCrypto * entry.coinPrice).toFixed(2);

      return {
        ...entry,
        totalFIAT: (index + 1) * payload.investment,
        totalCrypto,
        costAverage,
        balanceFIAT,
        balanceCrypto,
      };
    });

    const totalInvestment = payload.investment * chartData.length;
    const totalValueCrypto = chartData.reduce(
      (prev, curr) => prev + curr.totalCrypto,
      0
    );

    // TODO: Move all this calculations into the map loop
    const recentPrice = chartData[chartData.length - 1].coinPrice;
    const totalValueFIAT = totalValueCrypto * recentPrice;

    const percentageChange = getPercentageChange(
      totalInvestment,
      totalValueFIAT
    );

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
