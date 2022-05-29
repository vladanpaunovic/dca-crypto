import { formatCurrency } from "@coingecko/cryptoformat";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { useAppContext } from "../Context/Context";
import Currency from "../Currency/Currency";

const MINIMUM_ROWS = 10;
const DataTable = () => {
  const { state } = useAppContext();
  const currentCoin = state.currentCoin;
  const [isShowingMore, setIsShowingMore] = useState(false);

  const tableData = isShowingMore
    ? [...state.chart.data]
    : [...state.chart.data].splice(0, MINIMUM_ROWS);

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
                    Average price
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
                    FIAT Balance ({state.settings.currency})
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    {currentCoin.symbol.toUpperCase()} purchased with{" "}
                    <Currency value={state.input.investment} />
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
                {tableData.map((entry) => {
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
                        <Currency value={entry.costAverage} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Currency value={entry.totalFIAT} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Currency value={entry.balanceFIAT} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatCurrency(
                          parseFloat(entry.totalCrypto) || 0,
                          currentCoin.symbol
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {entry.percentageChange > 0 && (
                          <span className="text-green-500">
                            +${entry.percentageChange}
                          </span>
                        )}

                        {entry.percentageChange < 0 && (
                          <span className="text-red-500">
                            {entry.percentageChange}%
                          </span>
                        )}

                        {parseFloat(entry.percentageChange) === 0 && (
                          <span>{entry.percentageChange}%</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {state.chart.data.length > MINIMUM_ROWS && (
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-100">
                    <td colSpan={7} className="text-sm">
                      <button
                        onClick={() => setIsShowingMore(!isShowingMore)}
                        className="flex items-center font-medium px-6 py-4 w-full h-full hover:font-semibold"
                      >
                        {isShowingMore ? (
                          <>
                            Show less <ChevronUpIcon className="ml-1 w-5 h-5" />
                          </>
                        ) : (
                          <>
                            Show more ({state.chart.data.length - MINIMUM_ROWS}{" "}
                            more)
                            <ChevronDownIcon className="ml-1 w-5 h-5" />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
