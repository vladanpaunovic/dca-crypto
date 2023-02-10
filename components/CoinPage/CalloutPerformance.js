import { TrendingUpIcon, TrendingDownIcon } from "@heroicons/react/solid";
import { Block, Callout } from "@tremor/react";
import { useAppState } from "../../src/store/store";
import { useTweetMessage } from "../TweetMessage/TweetMessage";

const CalloutPerformance = ({ chartData, isLumpSum }) => {
  const state = useAppState();
  const priceChartMessage = useTweetMessage({ isLumpSum, chartData });

  const type = isLumpSum ? "lumpSum" : "dca";
  const isEarning = state.chart[type].insights.percentageChange > 0;
  const color = isEarning ? "emerald" : "pink";
  const icon = isEarning ? TrendingUpIcon : TrendingDownIcon;

  return (
    <div data-testid="fact-message">
      <Block decoration="left" decorationColor={color}>
        <Callout
          icon={icon}
          title={"Fact"}
          text={priceChartMessage}
          color={color}
        />
      </Block>
    </div>
  );
};

export default CalloutPerformance;
