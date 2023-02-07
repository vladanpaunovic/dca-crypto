import Countdown from "react-countdown";
import dayjs from "dayjs";
import { ACTIONS } from "../Context/mainReducer";
import { FREE_TIER_CALCULATION_LIMIT } from "../../config";
import { ExclamationIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useStore } from "../../src/store/store";

const Limit = ({ canProceed }) => {
  const state = useStore();
  const session = useSession();

  const handleOnComplete = () => {
    state.dispatch({
      type: ACTIONS.UPDATE_CAN_PROCEED,
      payload: { proceed: true },
    });
  };

  return (
    <div className="bg-yellow-200 dark:bg-yellow-600 rounded-lg">
      <div className="py-6 px-3 sm:px-6 lg:px-6 ">
        <div className="flex flex-wrap flex-col md:flex-row items-center justify-between">
          <div className="flex md:w-0 flex-1 items-center">
            <span className="flex rounded-lg bg-yellow-400 dark:bg-yellow-900 p-2">
              <ExclamationIcon
                className="h-6 w-6 text-yellow-900 dark:text-yellow-400"
                aria-hidden="true"
              />
            </span>
            <div className="ml-3 font-medium text-gray-900">
              <p className="font-bold">
                <span className="md:hidden">Limit reached.</span>
                <span className="hidden md:inline">
                  You reached your free limit of {FREE_TIER_CALCULATION_LIMIT}{" "}
                  tasks per hour.
                </span>
              </p>
              <p className="text-gray-900">
                Please{" "}
                <Link href="/pricing" className="underline">
                  upgrade
                </Link>{" "}
                to continue this calculation or break for{" "}
                <Countdown
                  date={dayjs().add(canProceed.ttl, "seconds").toDate()}
                  daysInHours={true}
                  className="font-bold"
                  onComplete={handleOnComplete}
                />
                .
              </p>
            </div>
          </div>
          <div className="order-3 flex mt-6 md:mt-0 w-full md:w-auto">
            <div className="w-full">
              <Link
                href="/pricing"
                className="flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 font-medium leading-6 text-white shadow-sm hover:opacity-80"
              >
                Upgrade
              </Link>
            </div>
            {session.status === "unauthenticated" && (
              <div className="ml-4 w-full">
                <button
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-yellow-400 dark:bg-yellow-900 px-4 py-2 font-medium leading-6 text-yellow-900 dark:text-yellow-400 shadow-sm hover:opacity-80"
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
  );
};

export default Limit;
