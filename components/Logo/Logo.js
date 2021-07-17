import { SwitchHorizontalIcon } from "@heroicons/react/outline";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <a className="flex font-medium items-center border dark:border-gray-800 rounded ">
        <div className="px-2 flex">
          <span className="rounded-full text-lg text-indigo-700 transform rotate-45 bg-white font-bold dark:bg-gray-800 dark:text-yellow-500 dark:border-gray-900">
            <SwitchHorizontalIcon className="w-6 h-6" />
          </span>
        </div>
        <span className="pl-2 pr-4 py-1 text-lg text-gray-900 bg-gray-100 font-medium  dark:bg-gray-800 dark:text-white dark:border-gray-900">
          DCA Cryptocurrency
        </span>
      </a>
    </Link>
  );
};

export default Logo;
