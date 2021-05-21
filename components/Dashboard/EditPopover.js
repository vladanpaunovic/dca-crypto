import { Popover, Transition } from "@headlessui/react";
import { PencilAltIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { useUpdateTradingBot } from "../../queries/queries";
import { useDashboardContext } from "../DashboardContext/DashboardContext";
import Loading from "../Loading/Loading";

const EditPopover = () => {
  const { state } = useDashboardContext();
  const [updatedBot, setUpdatedBot] = useState({
    origin_currency_amount: state.selectedBot.origin_currency_amount,
    investing_interval: state.selectedBot.investing_interval,
    interval_type: state.selectedBot.interval_type,
    isActive: true,
    errorMessage: "",
  });

  const updateTradingBot = useUpdateTradingBot();

  const handleOnSubmit = (e) => {
    e.preventDefault();

    updateTradingBot.mutate(updatedBot);
  };

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="focus:outline-none px-1 py-1 flex items-center justify-between text-xs leading-5 font-semibold rounded-full  hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400">
            {updateTradingBot.isLoading ? (
              <span className="mx-1">
                <Loading width={20} height={20} />
              </span>
            ) : (
              <PencilAltIcon className="w-5 h-5" />
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
              <form
                onSubmit={handleOnSubmit}
                className="p-4 bg-white dark:bg-gray-900 rounded border dark:border-gray-700 shadow max-w-sm"
              >
                <h4 className="text-normal font-medium mb-2">Edit bot</h4>
                <p className="mb-2 text-gray-500 ">
                  You can edit only limited fields of this bot. If you need more
                  customization, we encourage you to create a new one.
                </p>

                <label className="block mb-3 mt-8">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Investment
                  </span>
                  <div className="flex rounded-md">
                    <input
                      className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      type="number"
                      name="origin_currency_amount"
                      required
                      value={updatedBot.origin_currency_amount}
                      onChange={(e) =>
                        setUpdatedBot({
                          ...updatedBot,
                          origin_currency_amount: e.target.value,
                        })
                      }
                    />
                    <span className="focus:border-gray-300 inline-flex items-center justify-end px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-sm dark:bg-gray-700 dark:border-gray-700 dark:text-gray-200">
                      {state.selectedBot.destination_currency}
                    </span>
                  </div>
                </label>

                <label className="block">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Every
                  </span>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      name="origin_currency_amount_interval"
                      value={updatedBot.investing_interval}
                      onChange={(e) =>
                        setUpdatedBot({
                          ...updatedBot,
                          investing_interval: e.target.value,
                        })
                      }
                      className="flex-1 block rounded-none rounded-l-md sm:text-sm border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                    />
                    <select
                      value={updatedBot.interval_type}
                      onChange={(e) =>
                        setUpdatedBot({
                          ...updatedBot,
                          interval_type: e.target.value,
                        })
                      }
                      className="focus:border-gray-300 inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-sm dark:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
                    >
                      <option value="minute">minutes</option>
                      <option value="hour">hours</option>
                      <option value="day">days</option>
                      <option value="week">weeks</option>
                    </select>
                  </div>
                </label>

                <button
                  disabled={updateTradingBot.isLoading}
                  className="flex mt-8 justify-center items-center rounded font-medium bg-indigo-500 dark:bg-yellow-500 p-2 text-white dark:text-gray-900 w-full"
                >
                  Update {state.selectedBot.trading_pair} bot
                  {updateTradingBot.isLoading ? (
                    <span className="mx-1">
                      <Loading width={20} height={20} />
                    </span>
                  ) : (
                    <PencilAltIcon className="ml-2 w-5 h-5" />
                  )}
                </button>
              </form>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default EditPopover;
