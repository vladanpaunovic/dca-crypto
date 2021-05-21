import { formatCurrency } from "@coingecko/cryptoformat";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useDashboardContext } from "../DashboardContext/DashboardContext";
import getPercentageChange from "../helpers/getPercentageChange";

dayjs.extend(localizedFormat);

const OrdersDataTable = () => {
  const { state } = useDashboardContext();

  if (!state.selectedBot) {
    return null;
  }

  if (!state.selectedBot.orders.length) {
    return (
      <span className="p-6 block text-gray-700 dark:text-gray-400">
        There are no orders yet.
      </span>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-900 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-900">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Coin price
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Investment
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Crypto Balance ({state.selectedBot.origin_currency})
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Balance ({state.selectedBot.destination_currency})
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Profit/Loss %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-900">
                {state.selectedBot.orders.map((entry) => {
                  const percentageDifference = getPercentageChange(
                    entry.totalInvestment,
                    entry.balanceInQuoteCurrency * entry.price
                  );

                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-100"
                    >
                      <td className="pl-6 pr-2 py-4 whitespace-nowrap text-xs">
                        {dayjs(entry.dateTime).format("LLL")}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {formatCurrency(
                          entry.price,
                          state.selectedBot.destination_currency
                        )}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {formatCurrency(
                          entry.totalInvestment,
                          state.selectedBot.destination_currency
                        )}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {formatCurrency(
                          entry.balanceInQuoteCurrency,
                          state.selectedBot.origin_currency
                        )}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {formatCurrency(
                          entry.balanceInQuoteCurrency * entry.price,
                          state.selectedBot.destination_currency
                        )}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-xs">
                        {percentageDifference}
                        {/* {entry.percentageChange > 0 */}
                        {/* ? `+${entry.percentageChange}` */}
                        {/* : entry.percentageChange} */}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDataTable;
