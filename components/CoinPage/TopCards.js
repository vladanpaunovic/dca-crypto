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
import { useAppContext } from "../Context/Context";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import Currency, { formatPrice } from "../Currency/Currency";
import CardTotalInvestment from "./TotalInvestment";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const valueFormatter = (number) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  })
    .format(number)
    .toString();

const CardValueInFIAT = () => {
  const { state } = useAppContext();

  const isEarning = state.chart.dca.insights.percentageChange > 0;
  const color = isEarning ? "emerald" : "pink";

  const fiatEarnings =
    state.chart.dca.insights.totalValue?.fiat -
    state.chart.dca.insights.totalInvestment;

  const percentageChange = isEarning
    ? `+${state.chart.dca.insights.percentageChange}%`
    : `${state.chart.dca.insights.percentageChange}%`;

  const options = {
    title: "Value in FIAT",
    metric: <Currency value={state.chart.dca.insights.totalValue?.fiat || 0} />,
    metricPrev: (
      <Currency value={state.chart.dca.insights.totalInvestment || 0} />
    ),
    delta: isEarning ? (
      <>
        <Currency value={fiatEarnings} />
      </>
    ) : (
      <Currency value={fiatEarnings} />
    ),
    deltaType: isEarning ? "moderateIncrease" : "moderateDecrease",
  };

  const percentageChangeRaw = parseFloat(
    state.chart.dca.insights.percentageChange
  );
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

const CardCurrentCoin = () => {
  const { state } = useAppContext();
  const coinSymbol = state.currentCoin.symbol.toUpperCase();

  const currentPrice =
    state.chart.dca.chartData[state.chart.dca.chartData.length - 1]["Price"];

  const isEarning = state.chart.dca.insights.costAverage < currentPrice;
  const color = isEarning ? "emerald" : "pink";

  const options = {
    title: `${coinSymbol} selling price`,
    metric: <Currency value={currentPrice} />,
    metricPrev: <Currency value={state.chart.dca.insights.costAverage || 0} />,
    delta: <Currency value={state.chart.dca.chartData[0]["Price"] || 0} />,
    deltaType: isEarning ? "moderateDecrease" : "moderateIncrease",
  };

  const data = [
    {
      name: "Average price",
      value: state.chart.dca.insights.costAverage,
    },
    {
      name: "Selling price",
      value: currentPrice,
    },
  ];

  return (
    <Card key={options.title}>
      <Text>{options.title}</Text>
      <Flex
        justifyContent="justify-start"
        alignItems="items-baseline"
        spaceX="space-x-3"
        truncate
      >
        <Metric>{options.metric}</Metric>
        <Text truncate>1st order {options.delta}</Text>
      </Flex>

      <BarList
        data={data}
        color={color}
        valueFormatter={valueFormatter}
        marginTop="mt-4"
      />
    </Card>
  );
};

export default function TopCards() {
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
      <CardValueInFIAT />
      <CardCurrentCoin />

      <CardTotalInvestment
        totalInvestment={state.chart.dca.insights.totalInvestment}
        text={`Over ${
          state.chart.dca.chartData.length
        } instalments of ${formatPrice(state.chart.input.investment)}, every ${
          state.chart.input.investmentInterval
        } days`}
      />
    </ColGrid>
  );
}
