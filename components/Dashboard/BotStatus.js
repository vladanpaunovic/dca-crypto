import {
  ExclamationCircleIcon,
  PauseIcon,
  PlayIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/client";
import { useMutation } from "react-query";
import { queryClient } from "../../pages/_app";
import cmsClient from "../../server/cmsClient";
import Loading from "../Loading/Loading";
import { Popover, Transition } from "@headlessui/react";
import { useMySubscription } from "../../queries/queries";

export const BotStatus = (bot) => {
  const [session] = useSession();
  const mySubscription = useMySubscription();

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

  const isSubscriptionActive = mySubscription.data.isActive;

  if (bot.errorMessage) {
    return (
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              title="Error accured. Click to reveal information."
              className="border border-red-400 focus:outline-none px-2 py-1 flex items-center justify-between text-xs leading-5 font-semibold rounded-full  bg-red-100 text-red-800 dark:bg-red-400"
            >
              Error{" "}
              <span className="ml-1">
                {updateTradingBot.isLoading ? (
                  <Loading width={19} height={19} type="spin" />
                ) : (
                  <ExclamationCircleIcon className="w-5 h-5" />
                )}
              </span>
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
              <Popover.Panel className="absolute z-10 w-screen px-4 transform -translate-x-2/2 right-1/2 max-w-sm">
                <div className="p-4 bg-white dark:bg-gray-900 rounded border dark:border-gray-700 shadow max-w-sm">
                  <h4 className="text-normal font-medium mb-2">Order failed</h4>
                  <p className="mb-2 text-gray-600 dark:text-gray-300">
                    While processing your order, we received the following error
                    from your exchange:
                  </p>
                  <p className="bg-red-100 dark:bg-gray-800 dark:text-gray-100 p-2 text-normal mb-4 rounded">
                    {bot.errorMessage}
                  </p>
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
                        <Loading width={19} height={19} />
                      </span>
                    ) : (
                      <RefreshIcon className="w-5 h-5" />
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
      disabled={!isSubscriptionActive}
      onClick={() => updateTradingBot.mutate({ isActive: !bot.isActive })}
      className={`border focus:outline-none px-2 py-1 flex items-center justify-between  leading-5 font-semibold rounded-full ${
        bot.isActive
          ? " bg-green-100 text-green-800 border-green-400 dark:bg-green-400"
          : " bg-gray-200 text-gray-800 border-gray-400 dark:bg-gray-400"
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
          Active{" "}
          <span className="ml-1">
            {updateTradingBot.isLoading ? (
              <Loading width={19} height={19} type="spin" />
            ) : (
              <PauseIcon className="w-5 h-5" />
            )}
          </span>
        </>
      ) : (
        <>
          {isSubscriptionActive
            ? "Disabled"
            : "Disabled due to subscription expiration"}
          <span className="ml-1">
            {updateTradingBot.isLoading ? (
              <Loading width={19} height={19} type="spin" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </span>
        </>
      )}
    </button>
  );
};

export default BotStatus;
