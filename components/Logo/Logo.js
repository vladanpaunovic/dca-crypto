import { SwitchHorizontalIcon } from "@heroicons/react/outline";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex font-medium items-center border dark:border-gray-800 rounded"
    >
      <div className="px-2 py-2 flex">
        <span className="text-lg  text-indigo-700 transform rotate-45 bg-white font-bold dark:bg-gray-900 dark:text-yellow-500 dark:border-gray-900">
          <SwitchHorizontalIcon className="w-6 h-6" />
        </span>
      </div>
      <span className="hidden sm:block pl-2 pr-4 text-lg bg-white font-medium dark:bg-gray-900 text-gray-900 dark:text-white dark:border-gray-900">
        DCA Cryptocurrency
      </span>
    </Link>
  );
};

export default Logo;
