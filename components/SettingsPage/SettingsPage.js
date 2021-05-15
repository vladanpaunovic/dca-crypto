import DashboardTitle from "../Dashboard/DashboardTitle";
import DashboardMenu from "../Dashboard/Menu/DashboardMenu";
import {
  useAvailablePlans,
  useMySubscription,
  useMyTransaction,
} from "../../queries/queries";
import Loading from "../Loading/Loading";
import {
  CheckIcon,
  ClockIcon,
  ExclamationIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Link from "next/link";
import { ExchangesList } from "../Dashboard/MyExchanges";
dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const CurrentTransaction = ({ transaction }) => {
  if (!transaction) {
    return null;
  }

  const isBefore = dayjs(transaction.updatedAt).isBefore(new Date(), "hour");

  // When transaction is successfull and older then a day don't show
  if (transaction.paymentStatus === "charge:confirmed" && isBefore) {
    return null;
  }

  const paymentDate = dayjs(transaction.updatedAt).format("LLL");

  const humnizedPaymentDate = dayjs(paymentDate).fromNow();

  const status = () => {
    switch (transaction.paymentStatus) {
      case "charge:pending":
        return {
          icon: <ClockIcon className="w-10 h-10 animate-spin" />,
          label: "Pending payment...",
          className: "bg-white dark:bg-gray-900 dark:text-gray-900",
        };
      case "charge:delayed":
      case "charge:resolved":
        return {
          icon: <ClockIcon className="w-10 h-10  animate-spin" />,
          label: "Payment is being delayed...",
          className: "bg-white dark:bg-gray-900 dark:text-gray-900",
        };
      case "charge:confirmed":
        return {
          icon: <CheckIcon className="w-10 h-10" />,
          label: `Successfully paid ${humnizedPaymentDate}`,
          className: "text-green-500 dark:text-green-500",
        };
      case "charge:failed":
        return {
          icon: <ExclamationIcon className="w-10 h-10 dark:text-gray-900" />,
          label: "Payment failed",
          className: "bg-red-400 dark:bg-red-500",
        };
      default:
        return { icon: null, label: "", className: "" };
    }
  };

  return (
    <div className="flex bg-white dark:bg-gray-900 mt-4">
      <div
        className={`flex-none px-6 flex rounded-l-lg items-center justify-center ${
          status().className
        }`}
      >
        <span className=" ">{status().icon}</span>
      </div>
      <form className="flex-auto p-6">
        <div className="flex flex-wrap">
          <div className="w-full flex-none text-sm font-medium text-gray-500 dark:text-gray-300">
            {status().label}
          </div>
        </div>
      </form>
    </div>
  );
};

const CurrentSubscription = ({ subscription }) => {
  const subscriptionEndDate = dayjs(subscription.endDate).format("LL");

  const relativeEndDate = dayjs(subscription.endDate).fromNow();

  return (
    <div>
      <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div
          className={`flex-none px-6 flex rounded-l-lg items-center justify-center ${
            subscription.isActive
              ? "bg-green-200 dark:bg-green-600 dark:text-gray-900"
              : "bg-red-400 dark:bg-red-500"
          }`}
        >
          {subscription.isActive ? (
            <ShieldCheckIcon className="w-10 h-10 dark:text-gray-900" />
          ) : (
            <ExclamationIcon className="w-10 h-10 dark:text-gray-900" />
          )}
        </div>
        <form className="flex-auto p-6">
          <div className="flex flex-wrap">
            <h1 className="flex-auto text-xl font-semibold dark:text-gray-50">
              {subscription.plan.name} plan
            </h1>

            <div
              className={`w-full flex-none text-sm font-medium mt-2 ${
                subscription.isActive
                  ? "text-gray-500 dark:text-gray-300 "
                  : "text-red-500 dark:text-red-300 "
              }`}
            >
              {subscription.isActive
                ? `Active until ${subscriptionEndDate} (ends ${relativeEndDate})`
                : `Expired on ${subscriptionEndDate}`}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Subscription = () => {
  const availablePlans = useAvailablePlans();
  const mySubscription = useMySubscription();
  const myTransaction = useMyTransaction();

  if (
    availablePlans.isLoading ||
    mySubscription.isLoading ||
    myTransaction.isLoading
  ) {
    return <Loading width={20} height={20} />;
  }

  const basicPlan = availablePlans.data.find((plan) => plan.planId === "basic");
  const isFreeTrial = mySubscription.data.plan.planId === "free";

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-medium">Current subscription</h3>
        <div className="text-center">
          <Link href="/pricing">
            <a className="w-full py-2 px-4 bg-indigo-500 dark:bg-yellow-500 focus:ring-offset-indigo-200 text-white dark:text-gray-900 flex justify-center transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
              {isFreeTrial
                ? `Get a year for $${basicPlan.price}`
                : `Extend for $${basicPlan.price}/year`}
            </a>
          </Link>
          <span className="text-gray-500 dark:text-gray-300 text-sm block mt-2 font-light">
            No credit card required
          </span>
        </div>
      </div>
      <CurrentSubscription subscription={mySubscription.data} />
      <CurrentTransaction transaction={myTransaction.data} />
    </div>
  );
};

const Settings = () => {
  return (
    <div className="lg:flex">
      <div className="w-12/12 lg:w-16 bg-gray-900 dark:bg-gray-900 border-r border-gray-800">
        <DashboardMenu />
      </div>
      <div className="w-12/12 flex-1 bg-gray-100 dark:bg-gray-800 h-screen ">
        <DashboardTitle title="Settings" />
        <div className="p-8 flex">
          <div className="grid lg:grid-cols-2 gap-8 w-full">
            <div>
              <Subscription />
            </div>
            <div>
              <div className="rounded-lg bg-white dark:bg-gray-900 p-4 shadow-lg">
                <h3 className="text-lg font-medium mb-6">Your exchanges</h3>
                <ExchangesList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
