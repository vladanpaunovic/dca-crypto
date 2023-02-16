import Link from "next/link";
import { useState } from "react";
import { ChevronRightIcon, SearchIcon } from "@heroicons/react/outline";
import NextImage from "next/image";

const AllCoinsTable = ({ showOnlyNTokens, showSearch, availableTokens }) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!availableTokens) {
    return null;
  }

  const tokenList = showOnlyNTokens
    ? availableTokens.slice(0, showOnlyNTokens)
    : availableTokens;

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full md:px-2">
          <div className="shadow overflow-hidden lg:rounded-lg dark:border-gray-700 border xl:border rounded-none">
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
                          #{entry.marketCapRank}
                        </td>
                        <td className="px-6 whitespace-nowrap text-sm">
                          <Link
                            href={`/dca/${entry.id}`}
                            className="flex items-center py-4"
                          >
                            <div className="relative w-7 h-7 mr-2">
                              <NextImage
                                layout="fill"
                                objectFit="cover"
                                src={`https://assets.coincap.io/assets/icons/${entry.symbol.toLowerCase()}@2x.png`}
                                alt={`${entry.name} logo`}
                              />
                            </div>
                            <span className="font-medium">
                              <span className="uppercase">DCA</span>{" "}
                              {entry.name}
                            </span>{" "}
                            <span className="ml-1 text-gray-400">
                              {entry.symbol.toUpperCase()}
                            </span>
                          </Link>
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
                      <Link
                        href={`/all-tokens`}
                        className="flex items-center justify-start sm:justify-center hover:underline py-2"
                      >
                        More tokens{" "}
                        <span className="ml-1">
                          <ChevronRightIcon className="w-5 h-5" />
                        </span>
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
