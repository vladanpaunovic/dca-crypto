import { useMySubscription } from "../../queries/queries";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import {
  ExclamationIcon,
  SpeakerphoneIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useEffect, useState } from "react";
dayjs.extend(duration);
dayjs.extend(relativeTime);

const Banner = () => {
  const mySubscription = useMySubscription();
  const [isShown, setIsShown] = useState(false);
  const DAYS_THRESHOLD_TO_SHOW_WORNING = 20;

  useEffect(() => {
    if (mySubscription.data) {
      const daysUntilEnd = dayjs(mySubscription.data.endDate).diff(
        new Date(),
        "day"
      );

      if (daysUntilEnd <= DAYS_THRESHOLD_TO_SHOW_WORNING) {
        setIsShown(true);
      }
    }
  }, [mySubscription.data]);

  if (!mySubscription.data) {
    return null;
  }

  const daysUntilEnd = dayjs(mySubscription.data.endDate).diff(
    new Date(),
    "day"
  );
  const isEnded = daysUntilEnd <= 0;

  return (
    isShown && (
      <div className="fixed bottom-4 left-0 right-0">
        <div className="container bg-indigo-600 dark:bg-gray-800 border border-indigo-500 dark:border-gray-700 shadow-2xl rounded-xl max-w-4xl mx-auto py-3 px-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              {isEnded ? (
                <span className="flex p-2 rounded-lg bg-red-500">
                  <ExclamationIcon className="w-6 h-6 text-white dark:text-gray-100" />
                </span>
              ) : (
                <span className="flex p-2 rounded-lg bg-indigo-900 dark:bg-yellow-500">
                  <SpeakerphoneIcon className="w-6 h-6 text-white dark:text-gray-900" />
                </span>
              )}

              <p className="ml-3 font-medium text-white truncate">
                <span className="inline">
                  {isEnded
                    ? `Your ${mySubscription.data.plan.name} plan ended. All your DCA bots are paused. Please upgrade.`
                    : `Your ${mySubscription.data.plan.name} plan ends in ${daysUntilEnd} days`}
                </span>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <Link href="/pricing">
                <a className="flex dark:bg-yellow-500 dark:text-gray-900 items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50">
                  See pricing
                </a>
              </Link>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
              <button
                type="button"
                onClick={() => setIsShown(false)}
                className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              >
                <span className="sr-only">Dismiss</span>
                <XIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Banner;
