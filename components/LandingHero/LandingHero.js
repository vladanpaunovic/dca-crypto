/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  MenuIcon,
  SwitchHorizontalIcon,
  XIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";

export default function LandingHero({ availableTokens }) {
  const navigation = [
    {
      name: `DCA ${availableTokens[0].name}`,
      href: `/dca/${availableTokens[0].id}`,
    },
    {
      name: `DCA ${availableTokens[1].name}`,
      href: `/dca/${availableTokens[1].id}`,
    },
    { name: "All coins", href: "/all-tokens" },
  ];

  return (
    <div className="relative bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-gray-900 transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
          <Popover>
            {({ open }) => (
              <>
                <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                  <nav
                    className="relative flex items-center justify-between sm:h-10 lg:justify-start"
                    aria-label="Global"
                  >
                    <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                      <div className="flex items-center justify-between w-full md:w-auto">
                        <Link href="/dashboard">
                          <a
                            title="dashboard"
                            className="flex items-center text-xs uppercase font-bold leading-snug text-indigo-500 dark:text-yellow-500 hover:opacity-75 p-1 rounded-full transform rotate-45"
                          >
                            <SwitchHorizontalIcon className="w-10 h-10" />
                          </a>
                        </Link>
                        <div className="-mr-2 flex items-center md:hidden">
                          <Popover.Button className="bg-white dark:bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Open main menu</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                          </Popover.Button>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                      {navigation.map((item) => (
                        <Link href={item.href} key={item.name}>
                          <a className="font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900">
                            {item.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                    <div className="hidden md:flex">
                      <ThemeSwitch />
                    </div>
                  </nav>
                </div>

                <Transition
                  show={open}
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="duration-100 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Popover.Panel
                    focus
                    static
                    className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
                  >
                    <div className="rounded-lg shadow-md bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="px-5 pt-4 flex items-center justify-between">
                        <div>
                          <Link href="/dashboard">
                            <a
                              title="dashboard"
                              className="flex items-center text-xs uppercase font-bold leading-snug text-indigo-500 dark:text-yellow-500 hover:opacity-75 p-1 rounded-full transform rotate-45"
                            >
                              <SwitchHorizontalIcon className="w-6 h-6" />
                            </a>
                          </Link>
                        </div>
                        <div className="-mr-2">
                          <Popover.Button className="bg-white dark:bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Close main menu</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </Popover.Button>
                        </div>
                      </div>
                      <div className="px-2 pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                          <Link href={item.href} key={item.name}>
                            <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                              {item.name}
                            </a>
                          </Link>
                        ))}
                        <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <ThemeSwitch label="Switch theme" />
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">DCA & Lump sum</span>{" "}
                <span className="block text-indigo-600 dark:text-yellow-500 xl:inline">
                  calculator for crypto
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Remove emotions from your investing. By using our free tools you
                can understand the impact of your DCA and lump sum investments.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href={`/dca/${availableTokens[0].id}`}>
                    <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white dark:text-gray-900 bg-indigo-500 dark:bg-yellow-500 hover:bg-indigo-700 dark:hover:bg-yellow-300 md:py-4 md:text-lg md:px-10">
                      DCA {availableTokens[0].name}
                    </a>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link href="/all-tokens">
                    <a className="w-full flex items-center justify-center px-8 py-3 border-transparent dark:border-yellow-500 border-2 text-base font-medium rounded-md text-indigo-700 dark:text-yellow-500 dark:bg-transparent bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                      All tokens
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          //   src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
          src="https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
          alt=""
        />
      </div>
    </div>
  );
}
