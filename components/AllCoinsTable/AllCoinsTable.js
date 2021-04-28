import { useAppContext } from "../Context/Context";
import Currency from "../Currency/Currency";
import Link from "next/link";
import { useState } from "react";
import { ChevronRightIcon, SearchIcon } from "@heroicons/react/outline";

const AllCoinsTable = ({ showOnlyNTokens, showSearch }) => {
  const { state } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");

  const tokenList = showOnlyNTokens
    ? state.settings.availableTokens.slice(0, showOnlyNTokens)
    : state.settings.availableTokens;

  return (
    <div className="flex flex-col">
      <div className="my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden sm:rounded-lg dark:border-gray-700 border rounded">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-900">
              <thead className="bg-gray-50 dark:bg-gray-900">
                {showSearch && (
                  <tr>
                    <th
                      colSpan={4}
                      className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100"
                    >
                      <div className="flex shadow max-w-sm rounded">
                        <input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          type="text"
                          autoFocus
                          name="search"
                          id="search"
                          className="focus:outline-none dark:bg-gray-900 dark:border-gray-700 flex-1 rounded sm:text-sm border-gray-300 rounded-r-none "
                          placeholder="Search coin name"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                          <SearchIcon className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                        </span>
                      </div>
                    </th>
                  </tr>
                )}
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
                {tokenList
                  .filter((e) => {
                    if (searchQuery) {
                      return (
                        e.id.includes(searchQuery) ||
                        e.name.includes(searchQuery)
                      );
                    }

                    return true;
                  })
                  .map((entry) => {
                    return (
                      <tr
                        key={entry.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-100"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          #{entry.market_cap_rank}
                        </td>
                        <td className="px-6 whitespace-nowrap text-sm">
                          <Link href={`/dca/${entry.id}`}>
                            <a className="flex items-center py-4">
                              <img
                                className="w-7 mr-2"
                                src={entry.image}
                                width={28}
                                height={28}
                              />
                              <span className="font-medium">
                                DCA {entry.name}
                              </span>{" "}
                              <span className="ml-1 text-gray-400">
                                {entry.symbol.toUpperCase()}
                              </span>
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
                {showOnlyNTokens && (
                  <tr>
                    <th
                      colSpan={4}
                      scope="col"
                      className="px-6 py-3 w-10 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                    >
                      <Link href="/all-tokens">
                        <a className="flex items-center justify-start sm:justify-center hover:underline py-2">
                          More tokens{" "}
                          <span className="ml-1">
                            <ChevronRightIcon className="w-5 h-5" />
                          </span>
                        </a>
                      </Link>
                    </th>
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

export default AllCoinsTable;
