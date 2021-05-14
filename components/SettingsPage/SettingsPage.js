import DashboardTitle from "../Dashboard/DashboardTitle";
import DashboardMenu from "../Dashboard/Menu/DashboardMenu";
import CoinbaseCommerceButton from "react-coinbase-commerce";
import "react-coinbase-commerce/dist/coinbase-commerce-button.css";
import { useSession } from "next-auth/client";
import { useAvailablePlans, useMySubscriptions } from "../../queries/queries";
import Loading from "../Loading/Loading";
import {
  ClockIcon,
  ExclamationIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";

const PricingPlan = (props) => {
  const [session] = useSession();

  return (
    <div className="mx-auto bg-white h-36 w-96 rounded border-indigo-500 dark:bg-gray-800 shadow text-center p-4 mb-10">
      <div className="flex h-full items-center justify-between">
        <div className="flex h-full flex-col justify-between">
          <div>
            <span className="bg-gray-700 dark:bg-gray-400 rounded mr-2 text-white p-2">
              {props.name}
            </span>
            <span className="dark:text-white">Plan</span>
          </div>
          <div>
            <p className="mb-0 text-left text-gray-500 dark:text-gray-300">
              12 of 20 user
            </p>
            <div className="w-full h-4 bg-gray-400 rounded-full mt-3">
              <div className="w-2/3 h-full text-center text-xs text-white bg-indigo-500 rounded-full">
                60%
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-full flex-col justify-between">
          <p className="text-gray-900 dark:text-white text-4xl font-bold">
            <span className="text-sm">$</span>
            {props.price}
            <span className="text-gray-300 text-sm">/ year</span>
          </p>
          <button
            type="button"
            className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
          >
            <CoinbaseCommerceButton
              checkoutId={props.checkoutId}
              onChargeSuccess={(data) => console.log("SUCCESS", data)}
              onChargeFailure={(data) => console.log("FAILURE", data)}
              onPaymentDetected={(data) =>
                console.log("PAYMENT_DETECTED", data)
              }
              customMetadata={JSON.stringify({
                userId: session.user.id,
                plan: "609e414486c8a9582df466fd",
              })}
            >
              Upgrade
            </CoinbaseCommerceButton>
          </button>
        </div>
      </div>
    </div>
  );
};

const CurrentSubscription = (props) => {
  const status = () => {
    switch (props.paymentStatus) {
      case "charge:created":
      case "charge:pending":
      case "charge:delayed":
        return {
          icon: <ClockIcon className="w-20 h-20" />,
          label: "Pending payment...",
          className: "bg-white dark:bg-gray-900 dark:text-gray-900",
        };
      case "charge:confirmed":
        return {
          icon: <ShieldCheckIcon className="w-20 h-20 dark:text-gray-900" />,
          label: "Active until",
          className: "bg-green-200 dark:bg-green-600 dark:text-gray-900",
        };
      case "charge:failed":
        return {
          icon: <ExclamationIcon className="w-20 h-20 dark:text-gray-900" />,
          label: "Payment failed",
          className: "bg-red-400 dark:bg-red-400",
        };
      default:
        return { icon: null, label: "", className: "" };
    }
  };

  return (
    <div>
      <h3 className="mb-6 text-lg font-medium">Current subscription</h3>
      <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div
          className={`flex-none w-24 md:w-48 flex rounded-l-lg items-center justify-center ${
            status().className
          }`}
        >
          {status().icon}
        </div>
        <form className="flex-auto p-6">
          <div className="flex flex-wrap">
            <h1 className="flex-auto text-xl font-semibold dark:text-gray-50">
              {props.plan.name}
            </h1>
            <div className="text-xl font-semibold text-gray-500 dark:text-gray-300">
              ${props.plan.price}
            </div>
            <div className="w-full flex-none text-sm font-medium text-gray-500 dark:text-gray-300 mt-2">
              {status().label}
            </div>
          </div>
          <div className="flex items-baseline  text-sm font-medium mt-4 text-gray-700 dark:text-gray-300">
            {props.plan.name === "Basic" && (
              <button
                type="button"
                className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              >
                Upgrade to <b>Premium</b>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const Subscription = () => {
  const availablePlans = useAvailablePlans();
  const mySubscriptions = useMySubscriptions();

  if (availablePlans.isLoading || mySubscriptions.isLoading) {
    return <Loading width={20} height={20} />;
  }

  if (mySubscriptions.data.length) {
    return <CurrentSubscription {...mySubscriptions.data[0]} />;
  }

  const allPlans = availablePlans.data.map((plan) => <PricingPlan {...plan} />);

  return <div>{allPlans}</div>;
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
          <div className="grid-cols-3 gap-8">
            <div>
              <Subscription />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
