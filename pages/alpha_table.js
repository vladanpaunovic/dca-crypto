import "@tremor/react/dist/esm/tremor.css";
import coinResponse from "../src/dca_table/coin_response.json";
import ethResponse from "../src/dca_table/eth_response.json";
import solResponse from "../src/dca_table/sol_response.json";
import { getTableChartDataOverYears } from "../src/calculations/utils";
import DcaOverviewTable from "../components/DcaOverviewPage/DcaOverviewTable/DcaOverviewTable";

const getWidthsFromValues = (dataValues) => {
  let maxValue = -Infinity;
  dataValues.forEach((value) => {
    maxValue = Math.max(maxValue, value);
  });

  return dataValues.map((value) => {
    if (value === 0) return 0;
    return Math.max((value / maxValue) * 100, 1);
  });
};

export const getStaticProps = async () => {
  const coinPrices = [
    { ...coinResponse, coin: { id: "bitcoin", label: "Bitcoin" } },
    { ...ethResponse, coin: { id: "ethereum", label: "Ethereum" } },
    { ...solResponse, coin: { id: "solana", label: "Solana" } },
  ];

  // create an array listing last 5 years
  const years = Array.from(
    { length: 8 },
    (_, i) => new Date().getFullYear() - i
  );

  const responses = coinPrices.map((coinData) => ({
    years: getTableChartDataOverYears(coinData.prices, coinData.coin, years),
    coinId: coinData.coin.id,
    coinLabel: coinData.coin.label,
  }));

  const comparingValues = responses
    .flatMap((coin, coinIndex) =>
      coin.years.map((year, yearIndex) => [
        yearIndex,
        coinIndex,
        year.insights.percentageChange,
      ])
    )
    .sort(([aYear, aCoin], [bYear, bCoin]) => aYear - bYear || aCoin - bCoin)
    .reduce((result, item) => {
      const [key, _, value] = item;
      (result[key] || (result[key] = [])).push(value);
      return result;
    }, []);

  responses.forEach((coin, coinIndex) => {
    coin.years.forEach((year, yearIndex) => {
      year.value = comparingValues[yearIndex][coinIndex];
      const absoluteValues = comparingValues[yearIndex].map((value) =>
        Math.abs(value)
      );
      year.deltaValue = getWidthsFromValues(absoluteValues)[coinIndex];
    });
  });

  const coinWithHighestDeltaValue = (year) => {
    if (!comparingValues[year]) return null;

    const highestDeltaValue = Math.max(...comparingValues[year]);

    const coinIndex = comparingValues[year]
      .map((v) => parseFloat(v))
      .indexOf(highestDeltaValue);

    const highestCoin = { ...responses[coinIndex] };
    delete highestCoin.years;

    return highestCoin;
  };

  const bestPerformingAssetPerYear = Array.from(
    { length: years.length },
    (_, i) => coinWithHighestDeltaValue(i)
  );

  return {
    props: {
      title: "My page",
      tableData: responses,
      years,
      bestPerformingAssetPerYear,
    },
  };
};

const Page = (props) => {
  return (
    <div className="container mx-auto p-8 text-gray-900 ">
      <div className="">
        <DcaOverviewTable {...props} />
      </div>
    </div>
  );
};

export default Page;
