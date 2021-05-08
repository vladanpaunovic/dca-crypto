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
      return (
        <span className="focus:outline-none px-2 py-1 text-xs flex justify-center leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-400">
          Error
        </span>
      );
    }

    if (bot.isActive) {
      return (
        <span className="focus:outline-none px-2 py-1 text-xs flex justify-center leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-400">
          Active
        </span>
      );
    }

    return (
      <span className="focus:outline-none px-2 py-1 text-xs flex justify-center leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-400">
        Disabled
      </span>
    );
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
          <div className="flex items-baseline">
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
          <div className="text-sm text-gray-400">
            Buying {bot.origin_currency} with {bot.destination_currency}
          </div>
          <div className="text-sm text-gray-400 ">
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
          <div className="text-sm text-gray-400">
            {getPercentageDifference()}
          </div>
        </div>
      </td>
      <td
        className="pr-6 py-4 cursor-pointer align-top"
        onClick={handleOnClick}
      >
        <div className="text-sm text-gray-900 dark:text-gray-50 flex flex-col ">
          {previewStatus()}
        </div>
      </td>
    </tr>
  );
};

export default BotItem;
