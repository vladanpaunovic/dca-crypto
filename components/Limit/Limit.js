import Countdown from "react-countdown";
import dayjs from "dayjs";
import { ACTIONS } from "../Context/mainReducer";
import { FREE_TIER_CALCULATION_LIMIT } from "../../config";
import { ExclamationIcon } from "@heroicons/react/solid";
import { useSession, signIn } from "next-auth/react";
import { useAppState } from "../../src/store/store";
import { useQuery } from "react-query";
import dynamic from "next/dynamic";
import Loading from "react-loading";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

const DynamicPricing = dynamic(() => import("../Pricing/Pricing"), {
  ssr: false,
  loading: () => (
    <div className="h-96">
      <Loading withWrapper width={20} />
    </div>
  ),
});

const Limit = ({ canProceed }) => {
  const dispatch = useAppState((state) => state.dispatch);
  const session = useSession();
  const pricing = useQuery("pricing", () =>
    fetch("/api/billing/products").then((res) => res.json())
  );
  const posthog = usePostHog();

  const handleOnComplete = () => {
    dispatch({ type: ACTIONS.UPDATE_CAN_PROCEED, payload: { proceed: true } });
  };

  useEffect(() => {
    posthog?.capture("limit_reached", {
      limit: FREE_TIER_CALCULATION_LIMIT,
      canProceed: canProceed.proceed,
    });
  }, []);

  return (
    <div>
      <div className="bg-yellow-200 rounded-lg">
        <div className="py-6 px-3 sm:px-6 lg:px-6 ">
          <div className="flex flex-wrap flex-col md:flex-row items-center justify-between">
            <div className="flex md:w-0 flex-1 items-center">
              <span className="flex rounded-lg bg-yellow-400 p-2">
                <ExclamationIcon
                  className="h-6 w-6 text-yellow-900"
                  aria-hidden="true"
                />
              </span>
              <div className="ml-3 font-medium text-gray-900">
                <p className="font-bold">
                  <span className="md:hidden">Free limit reached.</span>
                  <span className="hidden md:inline">
                    You reached your free limit of {FREE_TIER_CALCULATION_LIMIT}{" "}
                    tasks per day.
                  </span>
                </p>
                <p className="text-gray-900">
                  Please upgrade to continue this calculation or wait for{" "}
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
            <div className="order-3 grid grid-cols-2 gap-4 mt-6 md:mt-0 w-full md:w-auto">
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
      {pricing.isSuccess && (
        <div className="bg-white mt-8 rounded-lg pb-3">
          <DynamicPricing pricing={pricing.data} />
        </div>
      )}
    </div>
  );
};

export default Limit;
