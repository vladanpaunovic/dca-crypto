import { useAppContext } from "../Context/Context";
import Currency from "../Currency/Currency";

const DataTable = () => {
  const { state } = useAppContext();
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-900 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-900">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Coin price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Investment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Balance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Profit/Loss %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-900">
                {state.chart.data.map((entry) => {
                  return (
                    <tr
                      key={entry.date}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-100"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {entry.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Currency value={entry.coinPrice} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Currency value={entry.totalFIAT} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Currency value={entry.balanceFIAT} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {entry.percentageChange > 0
                          ? `+${entry.percentageChange}`
                          : entry.percentageChange}
                        %
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

export default DataTable;
