import React from "react";
import { AppContextProvider } from "../components/Context/Context";
import Footer from "../components/Footer/Footer";
import { CACHE_INVALIDATION_INTERVAL, defaultCurrency } from "../config";
import { createStripeSession, getAllCoins } from "../queries/queries";
import { NextSeo } from "next-seo";
import { useMutation } from "react-query";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { classNames } from "../styles/utils";
import PaymentMethods from "../components/PaymentMethods/PaymentMethods";
import FAQ from "../components/FAQ/FAQ";
import Link from "next/link";
import dayjs from "dayjs";
import Countdown from "react-countdown";

export async function getServerSideProps(context) {
  const availableTokens = await getAllCoins(
    context.query.currency || defaultCurrency
  );

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
  );

  const isSuccessPayment = context.query?.payment === "success";

  if (!isSuccessPayment) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      availableTokens,
      calcType: context.query.type || "dca",
      isSuccessPayment,
    },
  };
}

const renderer = ({ seconds, completed }) => {
  if (completed) {
    return <span>Redirecting...</span>;
  } else {
    return <span>You will be redirected in {seconds} seconds.</span>;
  }
};

const ThankYou = () => {
  const router = useRouter();

  const handleOnComplete = () => {
    router.push("/dca/bitcoin");
  };

  return (
    <div>
      <div className="flex items-center justify-center mt-16 mb-4">
        <div className="mr-2">
          <CheckCircleIcon width={42} height={42} className="text-green-300" />
        </div>
        <h1 className="h1-title">Payment Successful!</h1>
      </div>
      <p className="text-center mb-8">
        <Countdown
          date={dayjs().add("5", "seconds")}
          daysInHours={true}
          className="font-bold"
          onComplete={handleOnComplete}
          renderer={renderer}
        />
      </p>
      <div className="text-center">
        <Link href={`/dca/bitcoin`}>
          <a className="bg-gray-900 font-medium text-white dark:bg-white dark:text-900 py-2 px-4 rounded-l-md hover:opacity-70">
            DCA Calculator
          </a>
        </Link>
        <Link href={`/lump-sum/bitcoin`}>
          <a className="border-l border-gray-700 dark:border-gray-200 bg-gray-900 font-medium text-white dark:bg-white dark:text-900 py-2 px-4 rounded-r-md hover:opacity-70">
            Lump-Sum Calculator
          </a>
        </Link>
      </div>
    </div>
  );
};

export default function HomeWrapper(props) {
  return (
    <AppContextProvider availableTokens={props.availableTokens}>
      <ThankYou />
    </AppContextProvider>
  );
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function PricingTab(props) {
  const { data, status } = useSession();
  const router = useRouter();

  const mutation = useMutation((payload) => createStripeSession(payload), {
    onSuccess: (response) => {
      if (data) {
        router.push(response.url);
      } else {
        signIn(undefined, { callbackUrl: response.url });
      }
    },
  });

  const handleOnSelect = () => {
    mutation.mutate({
      priceId: props.id,
      type: props.type,
      ...(data
        ? { customerId: data.user.stripeCustomerId, userId: data.user.id }
        : {}),
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
    isFavorable
      ? "text-white dark:text-gray-900"
      : "text-gray-900 dark:text-gray-300",
    "h-6 w-6 mr-2"
  );
  return (
    <div
      className={classNames(
        isFavorable
          ? "primary-gradient transform md:scale-105 text-white dark:text-gray-900 hover:scale-110"
          : "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:scale-105",
        "shadow-lg rounded-2xl w-full md:w-64 p-4 transform transition-all"
      )}
    >
      <div className="relative">
        <p className="text-xl font-bold mb-4">{props.product.name}</p>
        {isAnnual ? (
          <p className="absolute -bottom-4 left-0 text-xs font-normal text-indigo-600 dark:text-yellow-600">
            Get one month for free
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
          All unlimited features
        </li>

        {isRecurring ? (
          <li className="mb-3 flex items-center">
            <CheckCircleIcon className={featureClasses} /> Continuous access
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
      {data?.user?.hasActivePackage ? null : (
        <button
          type="button"
          disabled={status === "loading"}
          onClick={handleOnSelect}
          className="bg-gray-900 dark:bg-white rounded-md text-white dark:text-gray-900 p-2 w-full hover:opacity-80 transition"
        >
          Choose plan
        </button>
      )}
    </div>
  );
}

function Pricing(props) {
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
        <div className="w-full p-8 gap-8 flex-col md:flex-row bg-white dark:bg-gray-900 flex justify-center">
          {props.pricing.map((price) => (
            <PricingTab key={price.id} {...price} />
          ))}
        </div>
        <div className="w-full flex justify-center pt-16 pb-8">
          <PaymentMethods />
        </div>
        <div className="w-full flex justify-center pt-16 pb-8">
          <FAQ />
        </div>
      </main>

      <Footer availableTokens={props.availableTokens} />
    </div>
  );
}
