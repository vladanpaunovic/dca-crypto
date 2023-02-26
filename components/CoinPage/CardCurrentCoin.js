import { Flex, Metric, Block, Text, BadgeDelta } from "@tremor/react";
import NextImage from "next/image";
import { useAppState } from "../../src/store/store";
import { useQuery } from "react-query";
import { formatPrice } from "../Currency/Currency";

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
  const state = useAppState();
  const { isLoading, data, error } = useQuery(
    `currentCoin-${state.currentCoin.coinId}`,
    () => {
      return fetch(`/api/coins/${state.currentCoin.coinId}`).then((res) =>
        res.json()
      );
    }
  );

  if (isLoading) {
    return "Loading...";
  }

  if (error || !data) {
    return null;
  }

  const coinSymbol = state.currentCoin.symbol.toUpperCase();

  const priceAtMidnight =
    state.currentCoin.prices[state.currentCoin.prices.length - 1][1];

  const percentageChange = (
    ((priceAtMidnight - parseFloat(data.rateUsd)) / priceAtMidnight) *
    100
  ).toFixed(2);

  const deltaType = getDeltaType(percentageChange);

  return (
    <div className="p-4 sm:p-0" data-testid="coin-today-price">
      <Block>
        <Text>
          #{data.market_cap_rank} {coinSymbol} Today Price
        </Text>
        <Flex justifyContent="justify-start" alignItems="items-end">
          {state.input.isLoading ? null : (
            <div className="w-8 mr-2 h-8 hidden sm:block relative">
              <NextImage
                src={state.currentCoin.image}
                alt={`${state.currentCoin.name} logo`}
                width={32}
                height={32}
              />
            </div>
          )}

          <Metric>{formatPrice(parseFloat(data.rateUsd))}</Metric>

          <div className="mr-2" />

          <BadgeDelta
            tooltip={`${percentageChange}% within the last 24h`}
            size="xs"
            text={`${percentageChange}%`}
            deltaType={deltaType}
          />
        </Flex>
      </Block>
    </div>
  );
};

export default CardCurrentCoin;
