import dayjs from "dayjs";
import getPercentageChange from "../../components/helpers/getPercentageChange";

export const generateLumpSumResponse = ({
  response,
  payload,
  investmentCount,
}) => {
  const data = response.map((entry) => ({
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

  const chartData = reduced.map((entry) => {
    const totalFIAT = payload.investment * investmentCount;
    const coinPrice = parseFloat(firstInvestment.coinPrice);

    const totalCrypto = coinPrice === 0 ? 0 : parseFloat(totalFIAT) / coinPrice;

    const balanceFIAT = parseFloat(totalCrypto * entry.coinPrice);

    const percentageChange = getPercentageChange(totalFIAT, balanceFIAT);

    return {
      ...entry,
      Price: parseFloat(entry.coinPrice),
      "Total investment": parseFloat(totalFIAT),
      totalCrypto,
      "Buying price": parseFloat(coinPrice),
      "Balance in FIAT": balanceFIAT,
      balanceCrypto: totalCrypto,
      percentageChange,
    };
  });

  const mostRecentEntry = chartData[chartData.length - 1];

  const totalInvestment = mostRecentEntry["Total investment"];
  const totalValueFIAT = mostRecentEntry["Balance in FIAT"];
  const percentageChange = mostRecentEntry.percentageChange;
  const totalValueCrypto = mostRecentEntry.balanceCrypto;

  const output = {
    chartData,
    insights: {
      totalInvestment,
      totalValue: { crypto: totalValueCrypto, fiat: totalValueFIAT },
      percentageChange,
      duration: dayjs(payload.dateTo).diff(payload.dateFrom),
      opportunityCost: chartData[0].balanceCrypto * mostRecentEntry["Price"],
      coinPrice: mostRecentEntry["Price"],
    },
  };

  return output;
};
