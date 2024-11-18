import React from "react";
import { createStripeSession } from "../../src/queries";
import { NextSeo } from "next-seo";
import { useMutation } from "react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  CheckCircleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  StarIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import { classNames } from "../../styles/utils";
import PaymentMethods from "../../components/PaymentMethods/PaymentMethods";
import FAQ from "../../components/FAQ/FAQ";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function PricingTab(props) {
  const { data, status } = useSession();
  const router = useRouter();

  const mutation = useMutation((payload) => createStripeSession(payload), {
    onSuccess: (response) => {
      router.push(response.url);
    },
  });

  const handleOnSelect = () => {
    mutation.mutate({
      priceId: props.id,
      type: props.type,
      ...(data?.user?.id ? { userId: data.user.id } : {}),
    });
  };

  const isRecurring = !!props.recurring;

  const intervalLabel = isRecurring ? props.recurring.interval : "for 7 days";
  const pricingDescription = isRecurring
    ? "Recurring billing"
    : "One time payment";

  const isFavorable = isRecurring && props.recurring.interval === "month";
  const isAnnual = isRecurring && props.recurring.interval === "year";
  const featureClasses = classNames(
    isFavorable ? "text-white" : "text-gray-900",
    "h-6 w-6 mr-2"
  );
  return (
    <div
      className={classNames(
        isFavorable
          ? "primary-gradient transform md:scale-110 text-white hover:scale-115 ring-4 ring-indigo-500 ring-opacity-50"
          : "bg-gray-50 text-gray-900 hover:scale-105",
        "shadow-xl rounded-2xl w-full md:w-64 p-6 transform transition-all relative"
      )}
    >
      {isFavorable && (
        <div className="absolute -top-4 left-0 right-0 text-center">
          <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-1 rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}
      <div className="relative">
        <p className="text-xl font-bold mb-4">{props.product.name}</p>
        {isAnnual ? (
          <p className="absolute -bottom-4 left-0 text-xs font-normal text-indigo-600">
            Get <b>two months</b> for free
          </p>
        ) : null}
      </div>
      <p className="text-3xl font-bold">
        {priceFormatter.format(props.unit_amount / 100)}
        <span className="text-sm opacity-60">/ {intervalLabel}</span>
      </p>
      <p className="text-xs mt-4 opacity-60">{pricingDescription}</p>
      <ul className="text-sm w-full mt-6 mb-6">
        <li className="mb-3 flex items-center">
          <CheckCircleIcon className={featureClasses} />
          AI - chat with our data
        </li>

        <li className="mb-3 flex items-center">
          <CheckCircleIcon className={featureClasses} />
          All unlimited features
        </li>

        {isRecurring ? (
          <li className="mb-3 flex items-center">
            <CheckCircleIcon className={featureClasses} />
            Continuous access
          </li>
        ) : (
          <li className="mb-3 flex items-center">
            <CheckCircleIcon className={featureClasses} />
            Time limited access
          </li>
        )}
        {isRecurring ? (
          <li className="mb-3 flex items-center">
            <CheckCircleIcon className={featureClasses} />
            Full access
          </li>
        ) : (
          <li className="mb-3 flex items-center opacity-50">
            <XCircleIcon className={featureClasses} />
            Expires in 7 days
          </li>
        )}
      </ul>
      <button
        type="button"
        disabled={status === "loading"}
        onClick={handleOnSelect}
        className={classNames(
          isFavorable
            ? "bg-white text-indigo-600 hover:bg-indigo-50"
            : "bg-indigo-600 text-white hover:bg-indigo-700",
          "mt-8 w-full rounded-md px-4 py-2 font-semibold shadow-sm transition-colors duration-200"
        )}
      >
        Choose {props.product.name}
      </button>
    </div>
  );
}

function Pricing(props) {
  if (!props.pricing) {
    return null;
  }

  return (
    <div className="w-full">
      <NextSeo
        title="Pricing &amp; Upgrade - DCA-CC"
        description="Select a plan that's right for you"
      />
      <main className="w-full ">
        <div className="px-8 py-16">
          <h1 className="h1-title text-center">
            Select a plan that is right for you
          </h1>
        </div>
        <div className="w-full p-8 gap-8 flex-col md:flex-row bg-white flex justify-center">
          {props.pricing?.map((price) => (
            <PricingTab key={price.id} {...price} />
          ))}
        </div>
        <div className="w-full flex justify-center pt-16 pb-8">
          <PaymentMethods />
        </div>
        <FeatureComparison />
        <TrustIndicators />

        <SocialProof />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <FAQ />
        </div>
      </main>
    </div>
  );
}

function SocialProof() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5" />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-2">
              &quot;Been using DCA-CC for the past year. The AI helps me
              understand the math and spot optimal entry points during dips.
              Absolute game changer for my hodl strategy.&quot;
            </p>
            <p className="font-semibold text-gray-500">- @ivannet_eth</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5" />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-2">
              &quot;The historical data and unlimited calculations are 🔥.
              Finally got my DCA strategy dialed in across multiple alt coins.
              <br />
              Worth every dollar.&quot;
            </p>
            <p className="font-semibold text-gray-500">- @whale_trader_21</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5" />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-2">
              &quot;Was getting rekt countless times, because I was uninformed
              and trying to time the market. DCA-CC helped me set up proper DCA
              intervals and now I just chill while stacking. 🚀&quot;
            </p>
            <p className="font-semibold text-gray-500">- @defi_maxi</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-indigo-600">50K+</h3>
            <p className="mt-2 text-gray-600">Active Users</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-indigo-600">4.6M+</h3>
            <p className="mt-2 text-gray-600">Calculations Made</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-indigo-600">4.7/5</h3>
            <p className="mt-2 text-gray-600">User Rating</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-indigo-600">4200+</h3>
            <p className="mt-2 text-gray-600">Cryptocurrencies</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureComparison() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Features
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Free
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-indigo-50">
                Paid
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              {
                feature: "Calculations per day",
                free: "5",
                premium: "Unlimited",
              },

              {
                feature: "Historical Data",
                free: "Basic",
                premium: "Advanced",
              },
              {
                feature: "In-Depth Backtesting",
                free: "Basic",
                premium: "Advanced",
              },
              {
                feature: "Real-Time Cryptocurrency Data",
                free: "Limited",
                premium: "Full Access",
              },
              {
                feature: "AI Assistant",
                free: "/",
                premium: "Full Access",
              },
              {
                feature: "Personalized Investment Insights",
                free: "/",
                premium: "Full Access",
              },
              {
                feature: "Purchase History Simulation",
                free: "/",
                premium: "Full Access",
              },
              {
                feature: "Profit/Loss Analysis",
                free: "/",
                premium: "Full Access",
              },
            ].map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.feature}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 text-center">
                  {item.free}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 text-center bg-indigo-50">
                  {item.premium}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TrustIndicators() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 text-center">
        <ShieldCheckIcon className="h-12 w-12 mx-auto text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-green-900 mb-2">
          7-Day Money-Back Guarantee
        </h3>
        <p className="text-green-800 max-w-2xl mx-auto">
          Try DCA-CC Premium risk-free. If you're not completely satisfied
          within 14 days, we'll refund your payment - no questions asked.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="text-center">
          <LockClosedIcon className="h-8 w-8 mx-auto text-gray-500 mb-4" />
          <h4 className="font-semibold text-gray-900">Secure Payments</h4>
          <p className="text-gray-600 text-sm">
            Powered by Stripe with 256-bit SSL encryption
          </p>
        </div>
        <div className="text-center">
          <svg
            className="h-8 w-8 mx-auto text-gray-500 mb-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm1-8h4v2h-6V7h2v5z" />
          </svg>
          <h4 className="font-semibold text-gray-900">Email Support</h4>
          <p className="text-gray-600 text-sm">
            We&apos;ll respond to your emails within 24 hours
          </p>
        </div>
        <div className="text-center">
          <svg
            className="h-8 w-8 mx-auto text-gray-500 mb-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L1 21h22L12 2zm0 3.83L19.17 19H4.83L12 5.83zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" />
          </svg>
          <h4 className="font-semibold text-gray-900">No Hidden Fees</h4>
          <p className="text-gray-600 text-sm">Transparent pricing always</p>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
