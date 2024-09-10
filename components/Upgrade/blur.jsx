import { CheckCircleIcon, ChevronDoubleUpIcon } from "@heroicons/react/outline";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";

const InfoBar = () => {
  const session = useSession();
  const posthog = usePostHog();
  return (
    <div>
      <div className="bg-green-200 rounded-lg">
        <div className="p-6">
          <div className="flex flex-wrap flex-col md:flex-row items-center justify-between">
            <div className="flex md:w-0 flex-1 items-center">
              <span className="flex rounded-lg bg-green-400 p-2">
                <ChevronDoubleUpIcon
                  className="h-6 w-6 text-green-900"
                  aria-hidden="true"
                />
              </span>
              <div className="ml-3 font-medium text-gray-900">
                <p className="font-bold">
                  <span className="hidden md:inline">
                    Upgrade to unlock these features
                  </span>
                </p>
              </div>
            </div>

            <div className="order-3 grid grid-cols-2 gap-4 mt-6 md:mt-0 w-full md:w-auto">
              <div className="col-span-2 md:col-span-1">
                <Link
                  href="/pricing"
                  onClick={() => {
                    posthog?.capture("upgrade_clicked");
                  }}
                  className="flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 font-medium leading-6 text-white shadow-sm hover:opacity-80"
                >
                  Upgrade
                </Link>
              </div>
              {session.status === "unauthenticated" && (
                <div className="col-span-2 md:col-span-1">
                  <button
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-yellow-400 px-4 py-2 font-medium leading-6 text-yellow-900 shadow-sm hover:opacity-80"
                    onClick={() => signIn()}
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="md:px-24 mt-20 bg-white/40 rounded-xl p-8">
        <h2 className="text-2xl font-medium leading-6 text-gray-900 mb-12">
          What do you get by upgrading?
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 items-start gap-6 md:gap-8 flex-wrap">
          <li className="">
            <p className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <CheckCircleIcon className="w-6 h-6 mr-1 text-green-500" />{" "}
              Unlimited calculations
            </p>
            <p className="text-base leading-6 text-gray-500 hidden md:block">
              Perform as many calculations as you need without any restrictions,
              ensuring you can always make informed investment decisions.
            </p>
          </li>
          <li className="mb-2">
            <p className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <CheckCircleIcon className="w-6 h-6 mr-1 text-green-500" />{" "}
              Historical average price development
            </p>
            <p className="text-base leading-6 text-gray-500 hidden md:block">
              Access historical price data for all supported cryptocurrencies,
              allowing you to analyze past performance.
            </p>
          </li>
          <li className="mb-2">
            <p className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <CheckCircleIcon className="w-6 h-6 mr-1 text-green-500" />{" "}
              Simulation of purchase history
            </p>
            <p className="text-base leading-6 text-gray-500 hidden md:block">
              View a detailed history of all your purchases, including the
              amount, price, and date of each transaction.
            </p>
          </li>
          <li className=" mb-2">
            <p className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <CheckCircleIcon className="w-6 h-6 mr-1 text-green-500" /> Profit
              / loss by investment cadence
            </p>
            <p className="text-base leading-6 text-gray-500 hidden md:block">
              Track the performance of your investments over time, broken down
              by the frequency of your purchases.
            </p>
          </li>
          <li className=" mb-2">
            <p className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <CheckCircleIcon className="w-6 h-6 mr-1 text-green-500" /> AI -
              chat with the data
            </p>
            <p className="text-base leading-6 text-gray-500 hidden md:block">
              Adjust your investment parameters—like interval, amount, or time
              frame—on the go and instantly see how changes affect your
              performance.
            </p>
          </li>
          <li className=" mb-2">
            <p className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <CheckCircleIcon className="w-6 h-6 mr-1 text-green-500" />{" "}
              In-Depth Backtesting
            </p>
            <p className="text-base leading-6 text-gray-500 hidden md:block">
              Analyze how your DCA or Lump Sum strategy would have performed in
              past market conditions, allowing you to fine-tune your future
              investments.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default function Blur({ children }) {
  const session = useSession();

  if (!session.data?.user.hasActivePackage) {
    return (
      <div className="relative">
        <div className="blur-md pointer-events-none">{children}</div>

        <div className="absolute inset-0">
          <div className="absolute inset-0 flex p-8 justify-center">
            <div className="w-full max-w-4xl">
              <InfoBar />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
