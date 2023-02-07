import { Text, Title, Tracking, TrackingBlock } from "@tremor/react";
import { useStore } from "../../src/store/store";
import getPercentageChange from "../helpers/getPercentageChange";

const getDeltaType = (item) => {
  let deltaType = "unchanged";

  if (item.percentageChange > 0) {
    deltaType = "moderateIncrease";
  }

  if (item.percentageChange < 0) {
    deltaType = "moderateDecrease";
  }

  if (parseFloat(item.percentageChange) === 0) {
    deltaType = "unchanged";
  }

  return deltaType;
};

const CoinTracked = () => {
  const state = useStore();

  const statusStyles = {
    moderateIncrease: "emerald",
    moderateDecrease: "rose",
    unchanged: "amber",
  };

  const profitLoss = state.chart.dca.chartData.map((item) =>
    item.percentageChange > 0 ? "profit" : "loss"
  );

  const onlyProfit = profitLoss.filter((pl) => pl === "profit");

  const percentageDifference = getPercentageChange(
    profitLoss.length,
    onlyProfit.length
  );

  const inProfit = Math.round(100 - Math.abs(percentageDifference));

  return (
    <>
      <Title>Profit/Loss every {state.input.investmentInterval} days</Title>
      <Text>
        Based on your purchase interval you would make profit {inProfit}% of the
        time
      </Text>

      <Tracking marginTop="mt-6">
        {state.chart.dca.chartData.map((item) => (
          <TrackingBlock
            key={item.date}
            color={statusStyles[getDeltaType(item)]}
            tooltip={item.percentageChange}
          />
        ))}
      </Tracking>
    </>
  );
};

export default CoinTracked;
