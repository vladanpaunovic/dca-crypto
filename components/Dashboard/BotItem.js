import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/client";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "../../pages/_app";
import apiClient from "../../server/apiClient";
import cmsClient from "../../server/cmsClient";
import Loading from "../Loading/Loading";

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

  console.log(balance.data);
  const baseCurrencyBalance = balance.data.free[bot.destination_currency];
  const isActive = baseCurrencyBalance > bot.origin_currency_amount;

  return (
    <tr key={bot.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-gray-50">
          {bot.available_exchange.identifier.toUpperCase()}:
          <span className="text-gray-500 dark:text-gray-100 ">
            {bot.origin_currency}
            {bot.destination_currency}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-gray-100 ">
          ${bot.origin_currency_amount}
        </div>
        <div className="text-sm text-gray-500">
          Every {bot.investing_interval} days
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {balance.isLoading ? (
          <Loading width={20} height={20} />
        ) : (
          <>
            <div className="text-sm text-gray-900 dark:text-gray-100 ">
              {baseCurrencyBalance} {bot.origin_currency}
            </div>
            <div className="text-sm text-gray-500">Enough for</div>
          </>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            isActive
              ? " bg-green-100 text-green-800 dark:bg-green-400"
              : " bg-gray-100 text-gray-800 dark:bg-gray-400"
          }`}
        >
          {isActive ? "Active" : "Disabled"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {/* <button className="text-gray-200 dark:text-gray-600 hover:text-gray-900  dark:hover:text-gray-100 transition rounded-full">
        <PencilAltIcon className="w-5 h-5" />
      </button> */}
        <button
          onClick={() => mutate(bot._id)}
          className="ml-2 text-gray-200 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-500 transition rounded-full"
        >
          {isRemoving ? (
            <div className="py-2">
              <Loading width={20} height={20} />
            </div>
          ) : (
            <TrashIcon className="w-5 h-5" />
          )}
        </button>
      </td>
    </tr>
  );
};

export default BotItem;
