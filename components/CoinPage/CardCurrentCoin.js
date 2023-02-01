import {
  Flex,
  Metric,
  Block,
  Text,
  ProgressBar,
  BadgeDelta,
} from "@tremor/react";
import { useAppContext } from "../Context/Context";
import NextImage from "next/image";
import Currency, { formatPrice } from "../Currency/Currency";

function isWhatPercentOf(min, max, number) {
  return ((number - min) / (max - min)) * 100;
}

const getDeltaType = (percentageChange) => {
  let deltaType = "unchanged";

  if (percentageChange > 0) {
    deltaType = "moderateIncrease";
  }

  if (percentageChange < 0) {
    deltaType = "moderateDecrease";
  }

  if (parseFloat(percentageChange) === 0) {
    deltaType = "unchanged";
  }

  return deltaType;
};

const CardCurrentCoin = () => {
  const { state } = useAppContext();

  const coinSymbol = state.currentCoin.symbol.toUpperCase();

  const prices = {
    current: state.currentCoin.market_data.current_price.usd,
    highest: state.currentCoin.market_data.high_24h.usd,
    lowest: state.currentCoin.market_data.low_24h.usd,
  };

  const averagePrice = (prices.highest + prices.lowest) / 2;

  const percentageDiff = isWhatPercentOf(
    prices.lowest,
    prices.highest,
    prices.current
  );

  const deltaType = getDeltaType(
    state.currentCoin.market_data.price_change_percentage_24h
  );

  return (
    <div className="p-4 sm:p-0" data-testid="coin-today-price">
      <Block>
        <Text>
          #{state.currentCoin.market_cap_rank} {coinSymbol} Today Price
        </Text>
        <Flex justifyContent="justify-start" alignItems="items-end">
          {state.input.isLoading ? null : (
            <div className="w-8 mr-2 h-8 hidden sm:block relative">
              <NextImage
                src={state.currentCoin.image}
                alt={`${state.currentCoin.name} logo`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}

          <Metric>
            <Currency
              data-testid="current-coin-price"
              value={state.currentCoin.market_data.current_price.usd}
            />
          </Metric>

          <div className="mr-2" />

          <BadgeDelta
            tooltip={`${parseFloat(
              state.currentCoin.market_data.price_change_percentage_24h
            ).toFixed(2)}% within the last 24h`}
            size="xs"
            text={`${parseFloat(
              state.currentCoin.market_data.price_change_percentage_24h
            ).toFixed(2)}%`}
            deltaType={deltaType}
          />
        </Flex>

        <Text marginTop="mt-4">24H Range</Text>

        <Flex marginTop="mt-1">
          <Text>{formatPrice(prices.lowest)}</Text>
          <Text>avg {formatPrice(averagePrice)}</Text>
          <Text>{formatPrice(prices.highest)}</Text>
        </Flex>

        <ProgressBar
          percentageValue={percentageDiff}
          marginTop="mt-2"
          color={"indigo"}
          tooltip={`${parseFloat(
            state.currentCoin.market_data.price_change_percentage_24h
          ).toFixed(2)}% in the last 24h`}
        />
      </Block>
    </div>
  );
};

export default CardCurrentCoin;
