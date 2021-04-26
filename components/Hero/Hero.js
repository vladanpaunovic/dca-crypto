/* This example requires Tailwind CSS v2.0+ */
import { useAppContext } from "../Context/Context";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";
import Logo from "../Logo/Logo";
import { ACTIONS } from "../Context/mainReducer";
import Link from "next/link";
import { useState } from "react";

const popularAssets = [
  {
    id: "bitcoin",
    name: "Bitcoin",
  },
  {
    id: "ethereum",
    name: "Ethereum",
  },
  {
    id: "binancecoin",
    name: "Binance Coin",
  },
  {
    id: "ripple",
    name: "XRP",
  },
  {
    id: "cardano",
    name: "Cardano",
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
  },
  {
    id: "polkadot",
    name: "Polkadot",
  },
  {
    id: "uniswap",
    name: "Uniswap",
  },
  {
    id: "litecoin",
    name: "Litecoin",
  },
];

export default function Hero() {
  const [randomCoin] = useState(
    popularAssets[Math.floor(Math.random() * popularAssets.length)]
  );
  const { state, dispatch } = useAppContext();
  return (
    <div className="relative bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-gray-900  transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <nav
              className="relative flex items-center justify-between sm:h-10 lg:justify-start"
              aria-label="Global"
            >
              <div className="flex items-center  flex-grow flex-shrink-0 lg:flex-grow-0">
                <div className="flex items-center  md:w-auto">
                  <Logo />
                </div>
                <div className="-mr-2">
                  <button
                    className="ml-2 dark:text-white text-gray hover:text-gray-900 rounded-full p-1 mr-2 focus:outline-none"
                    onClick={() =>
                      dispatch({
                        type: ACTIONS.TOGGLE_DARK_MODE,
                        payload: !state.settings.darkMode,
                      })
                    }
                  >
                    {state.settings.darkMode ? (
                      <SunIcon className="w-5 h-5" />
                    ) : (
                      <MoonIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </nav>
          </div>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">
                  Dollar-cost averaging calculator for
                </span>{" "}
                <span className="block text-indigo-600 dark:text-yellow-500 xl:inline">
                  {randomCoin.name}
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Dollar-cost averaging (DCA) is an investment strategy in which
                an investor divides up the total amount to be invested across
                periodic purchases of a target asset in an effort to reduce the
                impact of volatility on the overall purchase (
                <a
                  href="https://www.investopedia.com/terms/d/dollarcostaveraging.asp"
                  target="_blank"
                  rel="nofollow"
                  className="underline"
                >
                  source
                </a>
                )
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href={`/dca/${randomCoin.id}`}>
                    <a className="w-full flex items-center justify-center px-8 py-3 border dark:bg-yellow-500 dark:text-gray-900 border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                      DCA {randomCoin.name}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute hero-pattern bg-white dark:bg-gray-600 lg:inset-y-0 lg:right-0 lg:w-1/2"></div>
    </div>
  );
}
