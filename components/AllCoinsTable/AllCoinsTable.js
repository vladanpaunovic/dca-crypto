import { useAppContext } from "../Context/Context";
import Currency from "../Currency/Currency";
import Link from "next/link";

const AllCoinsTable = () => {
  const { state } = useAppContext();

  if (state.settings.availableTokens.length === 0) {
    return (
      <div className="flex items-center py-10 dark:text-white font-medium">
        Loading list of cryptocurrencies...
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-900 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-900">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 w-10 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Rank
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                  >
                    Market cap
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-900">
                {state.settings.availableTokens.map((entry) => {
                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-100"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        #{entry.market_cap_rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link href={`/dca/${entry.id}`}>
                          <a className="flex items-center ">
                            <img className="w-7 mr-4" src={entry.image} />
                            {entry.name} {entry.symbol.toUpperCase()}
                          </a>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Currency value={entry.current_price} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Currency value={entry.market_cap} />
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

export default AllCoinsTable;
