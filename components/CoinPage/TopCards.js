import {
  Card,
  Callout,
  Metric,
  Text,
  Flex,
  BadgeDelta,
  ColGrid,
  CategoryBar,
} from "@tremor/react";
import { useAppContext } from "../Context/Context";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import Currency from "../Currency/Currency";
import { useTweetMessage } from "../TweetMessage/TweetMessage";
import { TrendingUpIcon, TrendingDownIcon } from "@heroicons/react/solid";
import { useQuery } from "react-query";
import { getCoinPrice } from "../../queries/queries";
import getPercentageChange from "../helpers/getPercentageChange";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

dayjs.extend(duration);
dayjs.extend(relativeTime);

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
    </Card>
  );
};

const PRICE_FETCH_INTERVAL = 60000; // 1 minute

const CardCurrentCoin = () => {
  const { state } = useAppContext();
  const coinSymbol = state.currentCoin.symbol.toUpperCase();
  const [shouldUpdatePrice, setShouldUpdatePrice] = useState(false);

  useInterval(() => setShouldUpdatePrice(true), PRICE_FETCH_INTERVAL);

  const query = useQuery({
    queryFn: () => getCoinPrice(state.currentCoin.id),
    queryKey: `price_${state.currentCoin.id}`,
    refetchInterval: PRICE_FETCH_INTERVAL,
    enabled: shouldUpdatePrice,
  });

  const currentPrice =
    query.data || state.currentCoin.market_data.current_price.usd;

  const isEarning = state.chart.dca.insights.costAverage < currentPrice;
  const color = isEarning ? "emerald" : "pink";

  const options = {
    title: `${coinSymbol} current price`,
    metric: <Currency value={currentPrice} />,
    metricPrev: <Currency value={state.chart.dca.insights.costAverage || 0} />,
    delta: <Currency value={state.chart.dca.chartData[0].coinPrice || 0} />,
    deltaType: isEarning ? "moderateDecrease" : "moderateIncrease",
  };

  const percentageDiff = parseFloat(
    getPercentageChange(currentPrice, state.chart.dca.insights.costAverage)
  );
  const categoryPercentageValues = isEarning
    ? [100 - (100 - (percentageDiff + 100)), 100 - (percentageDiff + 100)]
    : [100 - percentageDiff, percentageDiff];

  const categoryBarColor = isEarning ? "pink" : "emerald";

  const percentageValue = isEarning ? categoryPercentageValues[0] : 100;

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
        <Text truncate>1st order at {options.delta}</Text>
      </Flex>
      <Flex justifyContent="justify-start" spaceX="space-x-2" marginTop="mt-4">
        <BadgeDelta
          tooltip="Average price paid of one coin over time"
          color={categoryBarColor}
          isIncreasePositive={false}
          text={options.metricPrev}
          deltaType={options.deltaType}
        />
        <Flex justifyContent="justify-start" spaceX="space-x-1" truncate={true}>
          <Text>average price</Text>
        </Flex>
      </Flex>

      <CategoryBar
        categoryPercentageValues={categoryPercentageValues}
        percentageValue={percentageValue}
        colors={isEarning ? [color, "orange"] : ["orange", color]}
        marginTop="mt-4"
        showLabels={false}
        tooltip={
          isEarning
            ? `Average price is ${percentageDiff}% cheaper`
            : `Average price is more expensive by ${percentageDiff}%`
        }
      />
    </Card>
  );
};

const CalloutPerformance = () => {
  const { state } = useAppContext();
  const priceChartMessage = useTweetMessage();
  const isEarning = state.chart.dca.insights.percentageChange > 0;
  const color = isEarning ? "emerald" : "pink";
  const icon = isEarning ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Callout
      icon={icon}
      title={"Fact"}
      text={priceChartMessage}
      color={color}
    />
  );
};

export default function TopCards() {
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

      <CalloutPerformance />
    </ColGrid>
  );
}
