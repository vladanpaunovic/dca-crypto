import { useGetMyBots } from "../../queries/queries";
import BotItem from "./BotItem";
import NewBotModal from "./NewBotModal/NewBotModal";

const BotList = () => {
  const { data, isLoading } = useGetMyBots();

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
                    colSpan={2}
                    className="w-full px-4 h-16 border-b dark:border-gray-700 text-left text-lg font-medium dark:text-gray-100 tracking-wider"
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
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {data.map((bot, index) => (
                  <BotItem key={bot.id} index={index + 1} {...bot} />
                ))}
                <tr>
                  <td
                    colSpan={2}
                    className="px-3 py-4 bg-white dark:bg-gray-900"
                  >
                    <div className="flex justify-center">
                      <NewBotModal />
                    </div>
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
