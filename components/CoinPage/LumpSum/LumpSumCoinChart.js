import { Card, AreaChart, Title, Text, Divider } from "@tremor/react";
import { useAppState } from "../../../src/store/store";
import { valueFormatter } from "../../Chart/helpers";

export default function LumpSumCoinChart({ chartData }) {
  const state = useAppState();

  const isEarning = chartData.insights.percentageChange > 0;

  const color = isEarning ? "emerald" : "rose";

  const coinSymbol = state.currentCoin.symbol.toUpperCase();

  return (
    <Card>
      <Title>Earnings over time</Title>
      <Text>Estimate the development of your earnings over time</Text>
      <AreaChart
        marginTop="mt-4"
        data={chartData.chartData}
        categories={["Balance in FIAT", "Total investment"]}
        dataKey="date"
        colors={[color, "amber"]}
        valueFormatter={valueFormatter}
        height="h-80"
        showGridLines
      />

      <Divider />

      <Title>{coinSymbol} price over time</Title>
      <Text>Price development vs. average cost</Text>

      <AreaChart
        marginTop="mt-4"
        data={chartData.chartData}
        categories={["Price", "Buying price"]}
        dataKey="date"
        colors={["amber", color]}
        valueFormatter={valueFormatter}
        height="h-80"
        showGridLines
      />
    </Card>
  );
}
