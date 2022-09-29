import React from "react";
import { AppContextProvider } from "../components/Context/Context";
import { CACHE_INVALIDATION_INTERVAL, defaultCurrency } from "../config";
import { getAllCoins } from "../queries/queries";
import { useRouter } from "next/router";
import { CheckCircleIcon } from "@heroicons/react/solid";
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
          <a className="bg-gray-900 font-medium text-white dark:bg-white dark:text-gray-900 py-2 px-4 rounded-l-md hover:opacity-70">
            DCA Calculator
          </a>
        </Link>
        <Link href={`/lump-sum/bitcoin`}>
          <a className="border-l border-gray-700 dark:border-gray-200 bg-gray-900 font-medium text-white dark:bg-white dark:text-gray-900 py-2 px-4 rounded-r-md hover:opacity-70">
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