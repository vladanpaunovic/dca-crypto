import {
  PlayIcon,
  PauseIcon,
  TrashIcon,
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
            <Popover.Button className="focus:outline-none px-1 py-1 mr-2 flex items-center justify-between text-xs leading-5 font-semibold rounded-full  bg-red-100 text-red-800 dark:bg-red-400">
              <span className="ml-1">Error</span>
              {updateTradingBot.isLoading ? (
                <span className="mx-1">
                  <Loading width={15} height={15} />
                </span>
              ) : (
                <ExclamationCircleIcon className="ml-1 w-5 h-5" />
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
              <Popover.Panel className="absolute z-10 w-screen px-4 mt-3 transform -translate-x-2/2 right-1/2 max-w-sm">
                <div className="p-4 bg-white dark:bg-gray-900 rounded border dark:border-gray-700 shadow max-w-sm">
                  <h4 className="text-normal font-medium mb-2">Order failed</h4>
                  <p className="mb-2 text-gray-600 dark:text-gray-300">
                    While processing your order, we received the following error
                    from your exchange:
                  </p>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 text-normal mb-4 rounded">
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
      className={`focus:outline-none px-1 py-1 mr-2 flex items-center justify-between text-xs leading-5 font-semibold rounded-full ${
        bot.isActive
          ? " bg-green-100 text-green-800 dark:bg-green-400"
          : " bg-gray-100 text-gray-800 dark:bg-gray-400"
      }`}
      title={bot.errorMessage}
    >
      {bot.isActive ? (
        <>
          <span className="ml-1">Active</span>
          {updateTradingBot.isLoading ? (
            <span className="mx-1">
              <Loading width={15} height={15} />
            </span>
          ) : (
            <PauseIcon className="ml-1 w-5 h-5" />
          )}
        </>
      ) : (
        <>
          <span className="ml-1">Disabled</span>
          {updateTradingBot.isLoading ? (
            <span className="mx-1">
              <Loading width={15} height={15} />
            </span>
          ) : (
            <PlayIcon className="ml-1 w-5 h-5" />
          )}
        </>
      )}
    </button>
  );
};

const BotItem = (bot) => {
  const [session] = useSession();
  const { mutate, isLoading: isRemoving } = useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).delete(`/trading-bots/${payload}`),
    mutationKey: "remove-bot",
    onSettled: async () => {
      await queryClient.refetchQueries(["my-bots"]);
    },
  });

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

  const baseCurrencyBalance = balance.data.free[bot.destination_currency];
  const hasBalance = baseCurrencyBalance > bot.origin_currency_amount;
  const durationEstimate = Math.floor(
    baseCurrencyBalance / (bot.origin_currency_amount / bot.investing_interval)
  );

  const lastOrder = bot.orders[bot.orders.length - 1];
  const nextOrderDate = dayjs(lastOrder ? lastOrder.dateTime : new Date()).add(
    bot.investing_interval,
    "day"
  );

  const allInvestments = bot.orders.reduce(
    (prev, curr) => prev + curr.amount * curr.price,
    0
  );

  const priceNow = getTicker.data ? getTicker.data.ask : 0;
  const allCryptoValue = bot.orders.reduce(
    (prev, curr) => prev + curr.amount * priceNow,
    0
  );

  const diffUntilNextOrder = () => {
    if (!bot.isActive || bot.errorMessage) {
      return "Disabled";
    }

    return dayjs().to(dayjs(nextOrderDate));
  };

  const timeSinceLastOrder = dayjs().to(
    dayjs(lastOrder ? lastOrder.dateTime : new Date())
  );

  const getPercentageDifference = () => {
    const percentageDifference =
      100 *
      Math.abs(
        (allInvestments - allCryptoValue) /
          ((allInvestments + allCryptoValue) / 2)
      );

    if (isNaN(percentageDifference)) {
      return "0%";
    }

    return percentageDifference > 0 ? (
      <span className="text-green-500">+{percentageDifference.toFixed(2)}</span>
    ) : (
      <span className="text-red-400">{percentageDifference.toFixed(2)}</span>
    );
  };

  if (bot.trading_pair === "BTC/USD") {
    const allCryptoValue2 = bot.orders.reduce(
      (prev, curr) => prev + curr.amount * priceNow,
      0
    );
    console.log(bot.orders);
  }
  return (
    <tr key={bot.id} className=" ">
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
          {bot.index}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-gray-50">
          <span className="font-semibold">
            {bot.available_exchange.identifier.toUpperCase()}:
          </span>
          <span className="font-medium">
            {bot.origin_currency}
            {bot.destination_currency}
          </span>
          <div className="text-sm text-gray-400">
            Buying {bot.origin_currency} with {bot.destination_currency}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-gray-100 ">
          {formatCurrency(allInvestments, bot.destination_currency)}
        </div>
        <div className="text-sm text-gray-400">
          {formatCurrency(allInvestments, bot.destination_currency)} every{" "}
          {bot.investing_interval} days
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-gray-50">
          <div className="text-sm text-gray-900 dark:text-gray-100 ">
            {formatCurrency(allCryptoValue, bot.destination_currency)}
          </div>
          <div className="text-sm text-gray-400">
            {getPercentageDifference()}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        {balance.isLoading ? (
          <Loading width={20} height={20} />
        ) : (
          <>
            <div
              className={`text-sm ${
                baseCurrencyBalance > 0
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-red-400"
              }`}
            >
              {formatCurrency(baseCurrencyBalance, bot.destination_currency)}
            </div>
            <div
              className={`text-sm ${
                hasBalance ? "text-gray-400" : "text-red-400"
              }`}
            >
              {hasBalance
                ? `Enough for ${kFormatter(durationEstimate)} days`
                : "Insufficient balance"}
            </div>
          </>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-gray-50">
          <div className="text-sm text-gray-900 dark:text-gray-100 ">
            {diffUntilNextOrder()}
          </div>
          <div className="text-sm text-gray-400">
            Last trade {timeSinceLastOrder}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex">
          <BotStatus {...bot} />
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-medium">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button className="focus:outline-none px-1 py-1 mr-2 flex items-center justify-between text-xs leading-5 font-semibold rounded-full  hover:bg-red-100 dark:hover:bg-red-400 text-gray-400">
                {isRemoving ? (
                  <span className="mx-1">
                    <Loading width={20} height={20} />
                  </span>
                ) : (
                  <TrashIcon className="w-5 h-5" />
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
                <Popover.Panel className="absolute z-10 w-screen px-4 mt-3 transform -translate-x-2/2 right-1/2 max-w-sm">
                  <div className="p-4 bg-white dark:bg-gray-900 rounded border dark:border-gray-700 shadow max-w-sm">
                    <h4 className="text-normal font-medium mb-2">
                      Are you sure?
                    </h4>
                    <p className="mb-2 text-gray-600 dark:text-gray-300">
                      Removing the trading bot will stop the execution of
                      upciming trades and remove all data related to it from our
                      systems.
                    </p>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                      If you don't need this bot now, we suggest, you just put
                      it on pause.
                    </p>

                    <button
                      disabled={isRemoving}
                      onClick={() => mutate(bot.id)}
                      className="flex justify-center items-center rounded font-medium bg-red-500 p-2 text-white dark:text-gray-900 w-full"
                    >
                      Yes, remove {bot.trading_pair} bot
                      {isRemoving ? (
                        <span className="mx-1">
                          <Loading width={20} height={20} />
                        </span>
                      ) : (
                        <TrashIcon className="ml-2 w-5 h-5" />
                      )}
                    </button>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </td>
    </tr>
  );
};

export default BotItem;
