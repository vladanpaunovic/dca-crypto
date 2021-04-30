import Menu from "./Menu/Menu";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import NewExchangeModal from "./NewExchangeModal/NewExchangeModal";
import DashboardTitle from "./DashboardTitle";
import { useSession } from "next-auth/client";
import cmsClient from "../../server/cmsClient";
import {
  useDashboardContext,
  DASHBOARD_ACTIONS,
} from "../DashboardContext/DashboardContext";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "../../pages/_app";
import Loading from "../Loading/Loading";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-full">
      <div className="h-screen border-r dark:border-gray-700 shadow">
        <Menu />
      </div>
      <div className="h-screen w-full">{children}</div>
    </div>
  );
};

const ExchangesList = () => {
  const [session] = useSession();

  const { dispatch } = useDashboardContext();

  const { data, isLoading: isLoadingExchanges } = useQuery(
    "only-my-exchanges",
    async () => {
      const response = await cmsClient(session.accessToken).get("/exchanges");
      dispatch({
        type: DASHBOARD_ACTIONS.SET_MY_EXCHANGES,
        payload: response.data,
      });

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
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg">
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
                      <button
                        onClick={() => mutate(exchange._id)}
                        disabled={isLoading}
                        className="ml-2 text-gray-200 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-500 transition rounded-full"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
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
    <DashboardLayout>
      <div>
        <DashboardTitle title="My Exchanges" />
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
    </DashboardLayout>
  );
};

export default MyExchanges;
