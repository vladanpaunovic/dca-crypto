import {
  ExclamationCircleIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import NewExchangeModal from "./NewExchangeModal/NewExchangeModal";
import DashboardTitle from "./DashboardTitle";
import { useSession } from "next-auth/client";
import cmsClient from "../../server/cmsClient";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "../../pages/_app";
import Loading from "../Loading/Loading";
import { Popover, Transition } from "@headlessui/react";
import DashboardMenu from "./Menu/DashboardMenu";

const WarningPopover = ({ exchange }) => {
  const [session] = useSession();
  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).delete(`/exchanges/${payload}`),
    mutationKey: "remove-exchange",
    onSettled: async () => {
      await queryClient.refetchQueries(["only-my-exchanges"]);
    },
  });

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            title="Error accured. Click to reveal information."
            className="ml-2 text-gray-200 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-500 transition rounded-full"
          >
            {isLoading ? (
              <Loading width={20} height={20} type="spin" />
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
            <Popover.Panel className="absolute z-10 w-screen px-4 transform -translate-x-2/2 right-1/2 max-w-sm">
              <div className="p-4 bg-white dark:bg-gray-900 rounded border dark:border-gray-700 shadow max-w-sm">
                <h4 className="text-normal font-medium mb-2 text-left">
                  Are you sure?
                </h4>
                <p className="mb-4 text-gray-600 dark:text-gray-300 whitespace-normal text-left">
                  By removing API keys you are removing all trading bots
                  assotiated to it as well all as orders created!
                </p>
                <button
                  disabled={isLoading}
                  onClick={() => mutate(exchange._id)}
                  className="flex justify-center items-center rounded font-medium bg-red-400 dark:bg-red-700 p-2 text-red-900 dark:text-red-200 w-full"
                >
                  Yes, remove {exchange.available_exchange.label} API keys
                  {isLoading ? (
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
  );
};

const ExchangesList = () => {
  const [session] = useSession();

  const { data, isLoading: isLoadingExchanges } = useQuery(
    "only-my-exchanges",
    async () => {
      const response = await cmsClient(session.accessToken).get("/exchanges");

      return response.data;
    }
  );

  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).delete(`/exchanges/${payload}`),
    mutationKey: "remove-exchange",
    onSettled: async () => {
      await queryClient.refetchQueries(["only-my-exchanges"]);
    },
  });

  if (isLoadingExchanges) {
    return <Loading width={20} height={20} />;
  }
  return (
    <div className="flex flex-col">
      <div className="-my-2  sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow  border border-gray-200 dark:border-gray-700 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider"
                  >
                    Exchange
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((exchange) => (
                  <tr key={exchange._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-50">
                        <span className="text-gray-500 dark:text-gray-100 ">
                          {exchange.available_exchange.label}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-400">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* <button className="text-gray-200 dark:text-gray-600 hover:text-gray-900  dark:hover:text-gray-100 transition rounded-full">
                        <PencilAltIcon className="w-5 h-5" />
                      </button> */}
                      <div className="flex justify-end">
                        <WarningPopover exchange={exchange} />
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className="px-5 py-1 whitespace-nowrap">
                    {isLoading ? (
                      <div className="py-2">
                        <Loading width={20} height={20} />
                      </div>
                    ) : (
                      <NewExchangeModal />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyExchanges = () => {
  return (
    <div className="lg:flex">
      <div className="w-12/12 lg:w-16 bg-gray-900 dark:bg-gray-900 border-r border-gray-800">
        <DashboardMenu />
      </div>
      <div className="w-12/12 flex-1 bg-gray-100 dark:bg-gray-800 h-screen ">
        <DashboardTitle title="Your Exchanges" />
        <div className="p-8 flex">
          <div className="w-1/2 mr-4">
            <h2 className="text-lg">Connected exchanges</h2>
            <div className="mt-4 ">
              <ExchangesList />
            </div>
          </div>
          <div className="w-1/2 ml-4"></div>
        </div>
      </div>
    </div>
  );
};

export default MyExchanges;
