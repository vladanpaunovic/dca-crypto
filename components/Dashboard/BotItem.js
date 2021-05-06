import {
  PlayIcon,
  PauseIcon,
  ExclamationCircleIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/client";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "../../pages/_app";
import apiClient from "../../server/apiClient";
import cmsClient from "../../server/cmsClient";
import Loading from "../Loading/Loading";
import { Popover, Transition } from "@headlessui/react";
import { formatCurrency } from "@coingecko/cryptoformat";
import { kFormatter } from "../Chart/helpers";
import { useDashboardContext } from "../DashboardContext/DashboardContext";
import { ACTIONS } from "../DashboardContext/dashboardReducer";
import getPercentageChange from "../helpers/getPercentageChange";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const BotStatus = (bot) => {
  const [session] = useSession();
  const updateTradingBot = useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).put(
        `/trading-bots/${bot.id}`,
        payload
      ),
    mutationKey: "update-bot",
    onSuccess: async () => {
      await queryClient.refetchQueries(["my-bots"]);
    },
  });

  if (bot.errorMessage) {
    return (
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              title="Error accured. Click to reveal information."
              className="focus:outline-none px-1 py-1 flex items-center justify-between text-xs leading-5 font-semibold rounded-full  bg-red-100 text-red-800 dark:bg-red-400"
            >
              {updateTradingBot.isLoading ? (
                <Loading width={20} height={20} type="spin" />
              ) : (
                <ExclamationCircleIcon className="w-5 h-5" />
              )}
            </Popover.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute z-10 w-screen px-4 transform -translate-x-2/2 left-1/2 max-w-sm">
                <div className="p-4 bg-white dark:bg-gray-900 rounded border dark:border-gray-700 shadow max-w-sm">
                  <h4 className="text-normal font-medium mb-2">Order failed</h4>
                  <p className="mb-2 text-gray-600 dark:text-gray-300">
                    While processing your order, we received the following error
                    from your exchange:
                  </p>
                  <pre className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 p-2 text-normal mb-4 rounded">
                    {bot.errorMessage}
                  </pre>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    This bot will remain <b>disabled</b> until you fix the issue
                    with your exchange. Once fixed, please mark it as resolved
                    so we can try again.
                  </p>

                  <button
                    disabled={updateTradingBot.isLoading}
                    onClick={() =>
                      updateTradingBot.mutate({
                        isActive: true,
                        errorMessage: "",
                      })
                    }
                    className="flex justify-center items-center rounded font-medium bg-indigo-500 dark:bg-yellow-500 p-2 text-white dark:text-gray-900 w-full"
                  >
                    I resolved it, try again{" "}
                    {updateTradingBot.isLoading ? (
                      <span className="mx-1">
                        <Loading width={20} height={20} />
                      </span>
                    ) : (
                      <RefreshIcon className="ml-2 w-5 h-5" />
                    )}
                  </button>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  }

  return (
    <button
      onClick={() => updateTradingBot.mutate({ isActive: !bot.isActive })}
      className={`focus:outline-none px-1 py-1 flex items-center justify-between text-xs leading-5 font-semibold rounded-full ${
        bot.isActive
          ? " bg-green-100 text-green-800 dark:bg-green-400"
          : " bg-gray-100 text-gray-800 dark:bg-gray-400"
      }`}
      title={bot.errorMessage}
      title={
        bot.isActive
          ? "This bot is enaled. Disable?"
          : "This bot is disabled. Enable?"
      }
    >
      {bot.isActive ? (
        <>
          {updateTradingBot.isLoading ? (
            <Loading width={20} height={20} type="spin" />
          ) : (
            <PauseIcon className="w-5 h-5" />
          )}
        </>
      ) : (
        <>
          {updateTradingBot.isLoading ? (
            <Loading width={20} height={20} type="spin" />
          ) : (
            <PlayIcon className="w-5 h-5" type="spin" />
          )}
        </>
      )}
    </button>
  );
};

const BotItem = (bot) => {
  const { dispatch, state } = useDashboardContext();
  const [session] = useSession();

  const credentials = bot.exchange.api_requirements;
  const botExchange = bot.available_exchange.identifier;

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

  const priceNow = getTicker.data ? getTicker.data.ask : 0;
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

  const handleOnClick = () =>
    dispatch({ type: ACTIONS.SET_SELECTED_BOT, payload: bot });

  const isSelected = state.selectedBot && state.selectedBot._id === bot._id;

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
              {bot.available_exchange.identifier.toUpperCase()}:
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
      <td className="pr-6 py-4 align-top">
        <span className="flex justify-end">
          <BotStatus {...bot} />
        </span>
      </td>
    </tr>
  );
};

export default BotItem;
