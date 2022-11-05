import { TrendingUpIcon, TrendingDownIcon } from "@heroicons/react/solid";
import { Block, Callout } from "@tremor/react";
import { useAppContext } from "../Context/Context";
import { useTweetMessage } from "../TweetMessage/TweetMessage";

const CalloutPerformance = ({ chartData, isLumpSum }) => {
  const { state } = useAppContext();
  const priceChartMessage = useTweetMessage({ isLumpSum, chartData });

  const type = isLumpSum ? "lumpSum" : "dca";
  const isEarning = state.chart[type].insights.percentageChange > 0;
  const color = isEarning ? "emerald" : "pink";
  const icon = isEarning ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Block decoration="left" decorationColor={color}>
      <Callout
        icon={icon}
        title={"Fact"}
        text={priceChartMessage}
        color={color}
      />
    </Block>
  );
};

export default CalloutPerformance;
