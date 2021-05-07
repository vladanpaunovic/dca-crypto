import { useSession } from "next-auth/client";
import { useQuery } from "react-query";
import cmsClient from "../../server/cmsClient";
import { useDashboardContext } from "../DashboardContext/DashboardContext";
import { ACTIONS } from "../DashboardContext/dashboardReducer";
import BotItem from "./BotItem";
import NewBotModal from "./NewBotModal/NewBotModal";

const BotList = () => {
  const [session] = useSession();
  const { state, dispatch } = useDashboardContext();

  const { data, isLoading } = useQuery(
    "my-bots",
    async () => {
      const response = await cmsClient(session.accessToken).get(
        "/trading-bots"
      );

      return response.data;
    },
    {
      refetchInterval: 10000,
      onSettled: (data) => {
        if (state.selectedBot) {
          const currentBot = data.find(
            (bot) => bot.id === state.selectedBot.id
          );

          dispatch({ type: ACTIONS.SET_SELECTED_BOT, payload: currentBot });
        }
      },
    }
  );

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="-my-2 sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 table-fixed">
              <thead className="bg-white dark:bg-gray-900">
                <tr>
                  <th
                    colSpan={3}
                    className="w-full px-4 py-6 text-left text-lg font-medium text-gray-500 dark:text-gray-100 tracking-wider"
                  >
                    Your bots
                  </th>
                </tr>
                <tr>
                  <th
                    scope="col"
                    className="px-4 w-7/12 text-left py-3 text-xs font-medium text-gray-500 dark:text-gray-100 tracking-wider"
                  >
                    Symbol
                  </th>
                  <th
                    scope="col"
                    className="w-3/12 pr-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 tracking-wider"
                  >
                    Holdings
                  </th>
                  <th scope="col" className="w-2/12 relative px-6 py-3">
                    <span className="sr-only">Status</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {data.map((bot, index) => (
                  <BotItem key={bot.id} index={index + 1} {...bot} />
                ))}
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-1 whitespace-nowrap bg-white dark:bg-gray-900"
                  >
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

export default BotList;
