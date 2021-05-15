import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { useAvailablePlans, useMySubscription } from "../../queries/queries";

const Features = () => {
  return (
    <>
      <div className="mt-8">
        <div className="flex items-center">
          <h4 className="flex-shrink-0 pr-4 bg-white dark:bg-gray-800 text-sm leading-5 tracking-wider font-semibold uppercase text-indigo-500 dark:text-yellow-500">
            What&#x27;s included
          </h4>
          <div className="flex-1 border-t-2 border-gray-200 dark:border-gray-700"></div>
        </div>
        <ul className="mt-8 lg:grid lg:grid-cols-2 lg:col-gap-8 lg:row-gap-5">
          <li className="flex items-start lg:col-span-1">
            <div className="flex-shrink-0">
              <CheckIcon className="h-6 w-6 mr-2 text-green-400" />
            </div>
            <p className="ml-3 text-sm leading-5 text-gray-700 dark:text-gray-200">
              12 supported exchanges
            </p>
          </li>
          <li className="flex items-start lg:col-span-1">
            <div className="flex-shrink-0">
              <CheckIcon className="h-6 w-6 mr-2 text-green-400" />
            </div>
            <p className="ml-3 text-sm leading-5 text-gray-700 dark:text-gray-200">
              Full dashboard access
            </p>
          </li>
          <li className="flex items-start lg:col-span-1">
            <div className="flex-shrink-0">
              <CheckIcon className="h-6 w-6 mr-2 text-green-400" />
            </div>
            <p className="ml-3 text-sm leading-5 text-gray-700 dark:text-gray-200">
              100+ trading pairs available
            </p>
          </li>
          <li className="flex items-start lg:col-span-1">
            <div className="flex-shrink-0">
              <CheckIcon className="h-6 w-6 mr-2 text-green-400" />
            </div>
            <p className="ml-3 text-sm leading-5 text-gray-700 dark:text-gray-200">
              Free for the first month
            </p>
          </li>
          <li className="flex items-start lg:col-span-1">
            <div className="flex-shrink-0">
              <CheckIcon className="h-6 w-6 mr-2 text-green-400" />
            </div>
            <p className="ml-3 text-sm leading-5 text-gray-700 dark:text-gray-200">
              Rich insights and visualisation of your investments
            </p>
          </li>
          <li className="flex items-start lg:col-span-1">
            <div className="flex-shrink-0">
              <CheckIcon className="h-6 w-6 mr-2 text-green-400" />
            </div>
            <p className="ml-3 text-sm leading-5 text-gray-700 dark:text-gray-200">
              Unlimited amount of trading bots
            </p>
          </li>
        </ul>
      </div>
      <div className="mt-8">
        <div className="flex items-center">
          <h4 className="flex-shrink-0 pr-4 bg-white text-sm dark:bg-gray-800 leading-5 tracking-wider font-semibold uppercase text-indigo-500 dark:text-yellow-500">
            &amp; What&#x27;s not
          </h4>
          <div className="flex-1 border-t-2 border-gray-200 dark:border-gray-700"></div>
        </div>
        <ul className="mt-8 lg:grid lg:grid-cols-2 lg:col-gap-8 lg:row-gap-5">
          <li className="flex items-start lg:col-span-1">
            <div className="flex-shrink-0">
              <XIcon className="h-6 w-6 mr-2 text-red-500" />
            </div>
            <p className="ml-3 text-sm leading-5 text-gray-700 dark:text-gray-200">
              No Contracts. No setup, additional or any hidden payment processor
              fees
            </p>
          </li>
          <li className="flex items-start lg:col-span-1">
            <div className="flex-shrink-0">
              <XIcon className="h-6 w-6 mr-2 text-red-500" />
            </div>
            <p className="ml-3 text-sm leading-5 text-gray-700 dark:text-gray-200">
              No 2-week on-boarding, it takes 3 minutes
            </p>
          </li>
        </ul>
      </div>
    </>
  );
};

export const RegistrationCard = () => {
  const [session] = useSession();
  const availablePlans = useAvailablePlans();
  const basicPlanPrice =
    availablePlans.data && availablePlans.data.length
      ? availablePlans.data[0].price
      : 10;
  const monthlyPlanPrice = Math.round(basicPlanPrice / 12);

  return (
    <>
      <div className="py-48">
        <div className="text-center">
          <h2 className="leading-10 text-5xl font-extrabold text-white dark:text-gray-900 ">
            Simple model, no commitment.
          </h2>
          <p className="text-lg mb-12 mt-4 text-gray-200 dark:text-gray-800">
            Your first month is on us. After that, the price is $
            {monthlyPlanPrice} a month.
          </p>
        </div>
        <div className="relative max-w-screen-xl mx-auto ">
          <div className="pricing-box max-w-lg mx-auto rounded-lg shadow-xl overflow-hidden lg:max-w-none lg:flex">
            <div className="bg-white dark:bg-gray-800 px-6 py-8 lg:flex-shrink-1 lg:p-12">
              <h3 className="text-2xl leading-8 font-extrabold text-gray-900 sm:text-3xl sm:leading-9 dark:text-white">
                31 day of{" "}
                <span className="text-indigo-500 dark:text-yellow-500">
                  all features
                </span>
                , for{" "}
                <span className="text-indigo-500 dark:text-yellow-500">
                  free
                </span>{" "}
              </h3>
              <p className="mt-6 text-base leading-6 text-gray-500 dark:text-gray-200">
                Start dollar cost averaging for free with all the features we
                have to offer, start paying only after your first month.
              </p>
              <Features />
            </div>
            <div className="py-8 px-6 text-center bg-gray-50 dark:bg-gray-700 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
              <p className="text-lg leading-6 font-bold text-gray-900 dark:text-white">
                Start with
              </p>
              <div className="mt-4 flex items-center justify-center text-5xl leading-none font-extrabold text-gray-900 dark:text-white">
                <span>$0</span>
              </div>
              <p className="mt-4 text-sm leading-5">
                <span className="block font-medium text-gray-500 dark:text-gray-400">
                  Crypto payments:
                </span>
                <span className=" inline-block font-medium text-gray-500 dark:text-gray-400">
                  BTC, ETH, BCH, LTC, DAI, USDC
                </span>
              </p>
              <div className="mt-6">
                <div className="rounded-md shadow">
                  {session ? (
                    <Link href="/dashboard">
                      <a className="w-full py-4 px-4 bg-indigo-500 dark:bg-yellow-500 focus:ring-offset-indigo-200 text-white dark:text-gray-900 flex justify-center transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                        Go to dashboard
                      </a>
                    </Link>
                  ) : (
                    <Link href="/register">
                      <a className="w-full py-4 px-4 bg-indigo-500 dark:bg-yellow-500 focus:ring-offset-indigo-200 text-white dark:text-gray-900 flex justify-center transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                        Get Access
                      </a>
                    </Link>
                  )}
                </div>
                <span className="text-gray-500 dark:text-gray-300 text-sm block mt-2 font-light">
                  No credit card required (ever)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
