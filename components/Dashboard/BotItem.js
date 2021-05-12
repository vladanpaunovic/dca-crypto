import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "react-query";
import { queryClient } from "../../pages/_app";
import apiClient from "../../server/apiClient";
import { formatCurrency } from "@coingecko/cryptoformat";
import { useDashboardContext } from "../DashboardContext/DashboardContext";
import { ACTIONS } from "../DashboardContext/dashboardReducer";
import getPercentageChange from "../helpers/getPercentageChange";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const PingDot = ({ state }) => {
  switch (state) {
    case "active": {
      return (
        <div className="relative h-3 w-3" title="Bot operational">
          <span className="flex h-3 w-3">
            <span
              className={`relative inline-flex rounded-full h-3 w-3 bg-green-400`}
            ></span>
          </span>
        </div>
      );
    }
    case "disabled": {
      return (
        <div className="relative h-3 w-3" title="Bot is disabled">
          <span className="flex h-3 w-3">
            <span
              className={`relative inline-flex rounded-full h-3 w-3 bg-gray-500`}
            ></span>
          </span>
        </div>
      );
    }
    default: {
      return (
        <div className="relative h-3 w-3" title="An error occured in this bot">
          <span className="flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 bg-red-500`}
            ></span>
          </span>
        </div>
      );
    }
  }
};

const BotItem = (bot) => {
  const { dispatch, state } = useDashboardContext();

  const credentials = bot.exchange.api_requirements;
  const botExchange = bot.available_exchange
    ? bot.available_exchange.identifier
    : null;

  const balance = useQuery({
    queryFn: async () => {
      const response = await apiClient.post(
        `/exchanges/${botExchange}/balance`,
        { credentials }
      );

      return response.data;
    },
    queryKey: `my-balance-${botExchange}`,
  });

  const getTicker = useQuery({
    queryKey: `get-ticker-${bot.trading_pair}`,
    queryFn: async () => {
      const credentials = bot.exchange.api_requirements;
      const exchangeId = bot.available_exchange.identifier;

      const response = await apiClient.get(
        `/exchanges/${exchangeId}/fetch-ticker`,
        { params: { credentials, symbol: bot.trading_pair } }
      );

      return response.data;
    },
  });

  if (!balance.data) {
    return null;
  }

  const totalInvestment = bot.orders.length * bot.origin_currency_amount;

  const priceNow = getTicker.data
    ? getTicker.data.bid || getTicker.data.ask
    : 0;
  const totalBaseAmount = bot.orders.reduce(
    (prev, curr) => prev + curr.amount,
    0
  );

  const allCryptoValue = totalBaseAmount * priceNow;

  const percentageDifference = getPercentageChange(
    totalInvestment,
    allCryptoValue
  );

  const getPercentageDifference = () => {
    if (isNaN(percentageDifference)) {
      return "0%";
    }

    return percentageDifference > 0 ? (
      <span className="text-green-500">+{percentageDifference}</span>
    ) : (
      <span className="text-red-400">{percentageDifference}</span>
    );
  };

  const handleOnClick = async () => {
    dispatch({ type: ACTIONS.SET_SELECTED_BOT, payload: bot });

    await queryClient.refetchQueries([`get-tickers-${bot.trading_pair}`]);
  };

  const isSelected = state.selectedBot && state.selectedBot._id === bot._id;

  const previewStatus = () => {
    if (bot.errorMessage) {
      return <PingDot state="error" />;
    }

    if (bot.isActive) {
      return <PingDot state="active" />;
    }

    return <PingDot state="disabled" />;
  };

  return (
    <tr
      key={bot.id}
      className={`hover:bg-gray-200 dark:hover:bg-gray-800 ${
        isSelected
          ? "bg-gray-200 dark:bg-gray-800"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <td className="px-4 py-4 cursor-pointer" onClick={handleOnClick}>
        <div className="text-sm text-gray-900 dark:text-gray-50">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-semibold">
                {bot.available_exchange
                  ? bot.available_exchange.identifier.toUpperCase()
                  : null}
                :
              </span>
              <span className="font-medium">
                {bot.origin_currency}
                {bot.destination_currency}
              </span>
            </div>
            <span className="ml-2">{previewStatus()}</span>
          </div>
          <div className="text-xs text-gray-400">
            Buying {bot.origin_currency} with {bot.destination_currency}
          </div>
          <div className="text-xs text-gray-400 ">
            {formatCurrency(
              bot.origin_currency_amount,
              bot.destination_currency
            )}{" "}
            every{" "}
            <b>
              {bot.investing_interval}{" "}
              {bot.investing_interval > 1
                ? `${bot.interval_type}s`
                : bot.interval_type}
            </b>
          </div>
        </div>
      </td>
      <td
        className="pr-6 py-4 cursor-pointer align-top"
        onClick={handleOnClick}
      >
        <div className="text-sm text-gray-900 dark:text-gray-50 flex flex-col ">
          <div className="text-sm text-gray-900 dark:text-gray-100 ">
            {formatCurrency(allCryptoValue, bot.destination_currency)}
          </div>
          <div className="text-xs text-gray-400">
            {getPercentageDifference()}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default BotItem;
