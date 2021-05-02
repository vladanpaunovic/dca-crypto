import Menu from "./Menu/Menu";
import NewBotModal from "./NewBotModal/NewBotModal";
import DashboardTitle from "./DashboardTitle";
import { useQuery } from "react-query";
import cmsClient from "../../server/cmsClient";
import { useSession } from "next-auth/client";
import Loading from "../Loading/Loading";
import BotItem from "./BotItem";

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

  const { data, isLoading } = useQuery("my-bots", async () => {
    const response = await cmsClient(session.accessToken).get("/trading-bots");

    return response.data;
  });

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
                  <BotItem key={bot.id} {...bot} />
                ))}
                <tr>
                  <td colSpan={5} className="px-5 py-1 whitespace-nowrap">
                    <NewBotModal />
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
          <div className="w-full">
            <h2 className="text-lg">Available bots</h2>
            <div className="mt-4 ">
              <BotList />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
