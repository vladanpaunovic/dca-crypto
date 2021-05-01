import Menu from "./Menu/Menu";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import NewBotModal from "./NewBotModal/NewBotModal";
import DashboardTitle from "./DashboardTitle";
import { useMutation, useQuery } from "react-query";
import cmsClient from "../../server/cmsClient";
import { useSession } from "next-auth/client";
import Loading from "../Loading/Loading";
import { queryClient } from "../../pages/_app";

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

const BotList = () => {
  const [session] = useSession();

  const { mutate, isLoading: isRemoving } = useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).delete(`/trading-bots/${payload}`),
    mutationKey: "remove-bot",
    onSettled: async () => {
      await queryClient.refetchQueries(["my-bots"]);
    },
  });

  const { data, isLoading } = useQuery("my-bots", async () => {
    const response = await cmsClient(session.accessToken).get("/trading-bots");

    return response.data;
  });

  // const { data, isLoading } = useQuery("my-bots", async () => {
  //   const response = await cmsClient(session.accessToken).get("/trading-bots");

  //   return response.data;
  // });

  if (isLoading) {
    return null;
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
                    Symbol
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider"
                  >
                    Investment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider"
                  >
                    Balance
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
                {data.map((bot) => (
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
                      <div className="text-sm text-gray-900 dark:text-gray-100 ">
                        {bot.origin_currency}
                      </div>
                      <div className="text-sm text-gray-500">Enough for</div>
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
                        onClick={() => mutate(bot._id)}
                        className="ml-2 text-gray-200 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-500 transition rounded-full"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className="px-5 py-1 whitespace-nowrap">
                    {isRemoving ? (
                      <div className="py-2">
                        <Loading width={20} height={20} />
                      </div>
                    ) : (
                      <NewBotModal />
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

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div>
        <DashboardTitle title="Dashboard" />
        <div className="p-8 flex">
          <div className="w-1/2 mr-4">
            <h2 className="text-lg">Available bots</h2>
            <div className="mt-4 ">
              <BotList />
            </div>
          </div>
          <div className="w-1/2 ml-4"></div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
