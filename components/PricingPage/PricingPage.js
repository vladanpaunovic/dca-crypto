import CoinbaseCommerceButton from "react-coinbase-commerce";
import "react-coinbase-commerce/dist/coinbase-commerce-button.css";
import { useSession } from "next-auth/client";
import {
  useAvailablePlans,
  useMySubscription,
  useMyTransaction,
} from "../../queries/queries";
import Loading from "../Loading/Loading";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CheckIcon,
  ClockIcon,
  ExclamationIcon,
  LightningBoltIcon,
  MailIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Switch } from "@headlessui/react";
import { useState } from "react";
import Link from "next/link";
dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const CurrentTransaction = ({ transaction }) => {
  if (!transaction.id) {
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
          label: "Processing payment...",
          className: "bg-white dark:bg-gray-900 dark:text-yellow-500",
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
    <div className="flex bg-white dark:bg-gray-900 mt-4 rounded-lg shadow">
      <div
        className={`flex-none px-6 flex rounded-l-lg items-center justify-center ${
          status().className
        }`}
      >
        <span>{status().icon}</span>
      </div>
      <div className="flex-auto py-6 pr-6">
        <div className="flex flex-wrap">
          <div className="w-full text-left flex-none text-sm font-medium text-gray-500 dark:text-gray-300">
            {status().label}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = (props) => {
  return (
    <div className="flex flex-row mb-8">
      <div className="mr-4">
        <div className="p-2 primary-gradient rounded-md shadow-xl">
          {props.icon}
        </div>
      </div>
      <div className="">
        <h3 className="font-medium text-lg tracking-wider">{props.title}</h3>
        <p className="text-gray-400">{props.description}</p>
      </div>
    </div>
  );
};

const Pricing = () => {
  const [session] = useSession();
  const [isToggleEnabled, setIsToggleEnabled] = useState(false);
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
  const premiumPlan = availablePlans.data.find(
    (plan) => plan.planId === "premium"
  );
  const selectedPlan = isToggleEnabled ? premiumPlan : basicPlan;
  const monthlyPrice = isToggleEnabled
    ? Math.round(selectedPlan.price / 24)
    : Math.round(selectedPlan.price / 12);
  return (
    <div className="flex h-screen justify-center items-center  bg-indigo-300 dark:bg-gray-800 pattern-domino">
      <div className="flex flex-col md:flex-row md:max-w-4xl shadow-2xl h-full md:h-auto">
        <div className="w-2/2 md:w-1/2 flex flex-col justify-center items-end p-8 bg-white dark:bg-gray-900 md:rounded-l-lg">
          <div className="w-full max-w-2xl">
            <h3 className="text-indigo-500 dark:text-yellow-500 font-medium">
              FULL-FEATURED
            </h3>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-16">
              Everything you need to DCA crypto
            </h3>
            <div className="flex flex-col">
              <FeatureItem
                icon={
                  <ShieldCheckIcon className="w-7 h-7 text-white dark:text-gray-900" />
                }
                title="Trusted exchanges"
                description="We respect your choices on whom to trust, which is why we are commited to integrate with major, trusted crypto exchanges."
              />
              <FeatureItem
                icon={
                  <LightningBoltIcon className="w-7 h-7 text-white dark:text-gray-900" />
                }
                title="DCA bots, as many as you want"
                description="Make it easy. Create as many bots as you may need, connect with as many exchanges as you may wish. "
              />
              <FeatureItem
                icon={
                  <MailIcon className="w-7 h-7 text-white dark:text-gray-900" />
                }
                title="Email notifications"
                description="Nobody wants their bots to run idle. Whenever one of your bots gets an error from the exchange, we will notify you so you can act."
              />

              <FeatureItem
                icon={
                  <BadgeCheckIcon className="w-7 h-7 text-white dark:text-gray-900" />
                }
                title="All features enabled. No up sells"
                description="You will get everything we have for the price of your subscription. While new features will come, we won't charge you for them."
              />
            </div>
          </div>
        </div>
        <div className="w-2/2 md:w-1/2 flex flex-col justify-center items-start p-8 primary-gradient md:rounded-r-lg h-full md:h-auto">
          <div className="max-w-2xl w-full h-72 md:h-auto text-center">
            <p className="text-lg leading-6 font-bold text-white dark:text-gray-900">
              Price
            </p>
            <div className="mt-4 flex items-center justify-center text-6xl leading-none font-extrabold text-white dark:text-gray-900">
              <span>${monthlyPrice}/mo</span>
            </div>
            <p className="mt-4 text-sm leading-5">
              <span className="block font-medium text-indigo-200 dark:text-gray-900">
                Billed ${selectedPlan.price} annually
              </span>
            </p>
            {!myTransaction.data.id && (
              <div className="mt-6">
                <Switch.Group>
                  <div className="flex items-center justify-center">
                    <Switch.Label className="mr-4 text-indigo-200 text-sm dark:text-gray-900">
                      One year
                    </Switch.Label>
                    <Switch
                      checked={isToggleEnabled}
                      onChange={setIsToggleEnabled}
                      className={`${
                        isToggleEnabled
                          ? "bg-indigo-500 dark:bg-yellow-500"
                          : "bg-white dark:bg-gray-900"
                      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-indigo-500 dark:ring-yellow-500`}
                    >
                      <span
                        className={`${
                          isToggleEnabled
                            ? "translate-x-6 bg-white dark:bg-gray-900"
                            : "translate-x-1 bg-indigo-500 dark:bg-yellow-500"
                        } inline-block w-4 h-4 transform  rounded-full transition-transform`}
                      />
                    </Switch>
                    <Switch.Label className="ml-4 text-indigo-200 text-sm dark:text-gray-900">
                      Two years
                    </Switch.Label>
                  </div>
                </Switch.Group>
              </div>
            )}
            <div className="mt-32 mb-32">
              {myTransaction.data.id ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="max-w-sm">
                    <CurrentTransaction transaction={myTransaction.data} />
                  </div>
                  {myTransaction.data.paymentStatus === "charge:confirmed" && (
                    <div className="mt-6">
                      <Link href="/dashboard">
                        <a className="text-white dark:text-gray-900 font-medium underline p-2 flex items-center">
                          Go to Dashboard{" "}
                          <ArrowRightIcon className="ml-1 w-5 h-5 animate-pulse" />
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <div className="py-4 px-4 max-w-xs mx-auto w-full bg-white dark:bg-gray-900 text-indigo-500 dark:text-yellow-500 focus:ring-offset-indigo-200 transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                      <CoinbaseCommerceButton
                        checkoutId={selectedPlan.checkoutId}
                        onChargeSuccess={(data) => console.log("SUCCESS", data)}
                        onChargeFailure={(data) => console.log("FAILURE", data)}
                        onPaymentDetected={(data) =>
                          console.log("PAYMENT_DETECTED", data)
                        }
                        customMetadata={JSON.stringify({
                          userId: session.user.id,
                          plan: selectedPlan.planId,
                        })}
                      >
                        Get Full Access
                      </CoinbaseCommerceButton>
                    </div>
                  </div>
                  <span className="text-indigo-200 dark:text-gray-800 text-xs block mt-2">
                    Accepting BTC, ETH, BCH, LTC, DAI & USDC
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
