import {
  Card,
  Metric,
  Text,
  Flex,
  BadgeDelta,
  ColGrid,
  CategoryBar,
  Legend,
  BarList,
} from "@tremor/react";
import { useAppContext } from "../../Context/Context";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Currency from "../../Currency/Currency";
import CardTotalInvestment from "../TotalInvestment";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const valueFormatter = (number) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  })
    .format(number)
    .toString();

const CardValueInFIAT = ({ chartData }) => {
  const { state } = useAppContext();

  const isEarning = chartData.insights.percentageChange > 0;
  const color = isEarning ? "emerald" : "pink";

  const fiatEarnings =
    chartData.insights.totalValue?.fiat - chartData.insights.totalInvestment;

  const percentageChange = isEarning
    ? `+${chartData.insights.percentageChange}%`
    : `${chartData.insights.percentageChange}%`;

  const options = {
    title: "Value in FIAT",
    metric: <Currency value={chartData.insights.totalValue?.fiat || 0} />,
    metricPrev: <Currency value={chartData.insights.totalInvestment || 0} />,
    delta: isEarning ? (
      <>
        <Currency value={fiatEarnings} />
      </>
    ) : (
      <Currency value={fiatEarnings} />
    ),
    deltaType: isEarning ? "moderateIncrease" : "moderateDecrease",
  };

  const percentageChangeRaw = parseFloat(chartData.insights.percentageChange);
  const categoryPercentageValues = isEarning
    ? [100 - percentageChangeRaw, percentageChangeRaw]
    : [percentageChangeRaw + 100, 100 - (percentageChangeRaw + 100)];

  return (
    <Card key={options.title}>
      <Text>{options.title}</Text>
      <Flex
        justifyContent="justify-start"
        alignItems="items-baseline"
        spaceX="space-x-3"
        truncate={true}
      >
        <Metric color={color}>{options.metric}</Metric>
      </Flex>
      <Flex justifyContent="justify-start" spaceX="space-x-2" marginTop="mt-4">
        <BadgeDelta
          tooltip="Return of investment (ROI) over the dollar cost averaging period"
          deltaType={options.deltaType}
          text={options.delta}
        />
        <Flex justifyContent="justify-start" spaceX="space-x-1" truncate={true}>
          <Text color={color}>{percentageChange}</Text>
          <Text truncate={true}>
            in {dayjs.duration(state.input.duration, "days").humanize()}
          </Text>
        </Flex>
      </Flex>

      <CategoryBar
        categoryPercentageValues={categoryPercentageValues}
        colors={["orange", color]}
        marginTop="mt-4"
        showLabels={false}
        percentageValue={isEarning ? 100 : categoryPercentageValues[0] + 0.01}
        tooltip={
          isEarning
            ? `Earnings ${percentageChange}`
            : `Losing ${percentageChange}`
        }
      />
      <Legend
        categories={
          isEarning
            ? ["Investment", "Earnings"]
            : ["Remaining investment", "Lost value"]
        }
        colors={["orange", color]}
        marginTop="mt-3"
      />
    </Card>
  );
};

const CardCurrentCoin = ({ chartData }) => {
  const { state } = useAppContext();
  const coinSymbol = state.currentCoin.symbol.toUpperCase();

  const currentPrice = state.chart.lumpSum.insights.coinPrice;

  const isEarning = chartData.chartData[0].coinPrice < currentPrice;

  const color = isEarning ? "emerald" : "pink";

  const options = {
    title: `${coinSymbol} selling price`,
    metric: <Currency value={currentPrice} />,
    metricPrev: (
      <Currency value={chartData.chartData[0].coinPrice - currentPrice || 0} />
    ),
    delta: <Currency value={chartData.chartData[0].coinPrice || 0} />,
    deltaType: isEarning ? "moderateDecrease" : "moderateIncrease",
  };

  const data = [
    { name: "Buying price", value: chartData.chartData[0].coinPrice },
    {
      name: "Selling price",
      value: chartData.chartData[chartData.chartData.length - 1].coinPrice,
    },
  ];

  return (
    <Card key={options.title}>
      <Text>{options.title}</Text>

      <Metric>{options.metric}</Metric>

      <BarList
        data={data}
        color={color}
        valueFormatter={valueFormatter}
        marginTop="mt-4"
      />
    </Card>
  );
};

export default function LumpSumTopCards({ chartData }) {
  const { state } = useAppContext();
  return (
    <ColGrid
      gapX="gap-x-6"
      gapY="gap-y-6"
      marginTop="mt-6"
      numCols={1}
      numColsSm={2}
      numColsLg={3}
    >
      <CardValueInFIAT chartData={chartData} />
      <CardCurrentCoin chartData={chartData} />

      <CardTotalInvestment
        totalInvestment={state.chart.lumpSum.insights.totalInvestment}
        text={`Once on ${dayjs(state.chart.input.dateFrom).format("L")}`}
      />
    </ColGrid>
  );
}
