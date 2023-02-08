import dayjs from "dayjs";
import getPercentageChange from "../../components/helpers/getPercentageChange";

export const generateDCAResponse = ({ response, payload }) => {
  const data = response.map((entry) => ({
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
    const coinPrice = parseFloat(entry.coinPrice);
    prices.push(coinPrice);
    const cryptoAmountInThisPurchase =
      coinPrice === 0 ? 0 : parseFloat(payload.investment) / coinPrice;

    allCrypto.push(cryptoAmountInThisPurchase);
    const balanceCrypto = allCrypto.reduce((p, c) => p + c, 0);

    const totalFIAT = (index + 1) * payload.investment;

    const costAverage = parseFloat(totalFIAT / balanceCrypto);

    const balanceFIAT = parseFloat(balanceCrypto * entry.coinPrice);

    const percentageChange = getPercentageChange(totalFIAT, balanceFIAT);

    return {
      ...entry,
      Price: coinPrice,
      "Total investment": totalFIAT,
      totalCrypto: cryptoAmountInThisPurchase,
      "Average cost": costAverage,
      "Balance in FIAT": balanceFIAT,
      balanceCrypto,
      percentageChange,
    };
  });

  const lastItem = chartData[chartData.length - 1];
  const { balanceCrypto, percentageChange } = lastItem;

  const output = {
    chartData,
    insights: {
      totalInvestment: lastItem["Total investment"] || payload.investment,
      totalValue: {
        crypto: balanceCrypto.toFixed(6),
        fiat: lastItem["Balance in FIAT"],
      },
      percentageChange,
      duration: dayjs(payload.dateTo).diff(payload.dateFrom),
      opportunityCost: chartData[0].balanceCrypto * lastItem["Price"],
      lumpSum:
        (payload.investment / chartData[0].coinPrice) * lastItem["Price"],
      coinPrice: lastItem["Price"],
      costAverage: lastItem["Average cost"],
    },
  };

  return output;
};
